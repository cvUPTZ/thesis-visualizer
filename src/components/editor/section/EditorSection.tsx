import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { useThesisData } from '@/hooks/useThesisData';
import { supabase } from '@/integrations/supabase/client';
import { Section, Thesis, SectionType, Chapter, Citation, Figure, Table, Reference } from '@/types/thesis';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { EditorLayout } from '@/components/editor/layout/EditorLayout';
import { SectionHeader } from '@/components/editor/SectionHeader';

export default function SectionEditor() {
  const { thesisId, sectionId } = useParams<{ thesisId: string; sectionId: string }>();
  const { thesis, setThesis } = useThesisData(thesisId);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [section, setSection] = useState<Section | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) navigate('/login');
    };
    checkAuth();
  }, [navigate]);

  // Section loading and creation logic
  useEffect(() => {
    if (!thesis || !sectionId || !thesisId) return;

    const loadSection = async () => {
      try {
        setIsLoading(true);
        let currentSection = findExistingSection(thesis, sectionId);

        if (!currentSection) {
          currentSection = await handleSectionCreation();
          if (!currentSection) throw new Error('Section creation failed');
        }

        setSection(currentSection);
      } catch (err) {
        console.error('Section load error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load section');
        toast({
          title: "Error Loading Section",
          description: "The section could not be found or created",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSection();
  }, [thesis, sectionId, thesisId]);

  // Recursive section search with type safety
  const findExistingSection = (thesis: Thesis, targetId: string): Section | null => {
    const deepSearch = (sections: Section[]): Section | null => {
      return sections.reduce<Section | null>((acc, section) => {
        if (acc) return acc;
        if (section.id === targetId) return section;
        if (section.sections) return deepSearch(section.sections);
        return null;
      }, null);
    };

    return (
      thesis.generalIntroduction?.id === targetId ? thesis.generalIntroduction :
      thesis.generalConclusion?.id === targetId ? thesis.generalConclusion :
      deepSearch(thesis.frontMatter) ||
      deepSearch(thesis.backMatter) ||
      thesis.chapters?.reduce<Section | null>((acc, chapter) => {
        return acc || deepSearch(chapter.sections);
      }, null) ||
      null
    );
  };

  // Section creation handler with proper type enforcement
  const handleSectionCreation = async (): Promise<Section | null> => {
    try {
      const sectionType = getSectionTypeFromId(sectionId);
      const baseSection: Section = {
        id: sectionId,
        title: 'New Section',
        content: '',
        type: sectionType,
        required: sectionType === SectionType.GENERAL_INTRODUCTION || sectionType === SectionType.GENERAL_CONCLUSION,
        order: Date.now(), // Temporary ordering
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        figures: [],
        tables: [],
        citations: [],
        references: [],
      };

      const { error } = await supabase.rpc('create_section_if_not_exists', {
        p_thesis_id: thesisId,
        p_section_title: baseSection.title,
        p_section_type: sectionType,
        p_section_id: sectionId
      });

      if (error) throw error;

      // Update local state optimistically
      const newThesis = updateThesisStructure(thesis, baseSection, sectionType);
      setThesis(newThesis);
      
      return baseSection;

    } catch (err) {
      console.error('Section creation failed:', err);
      toast({
        title: "Creation Failed",
        description: "Could not create new section",
        variant: "destructive",
      });
      return null;
    }
  };

  // Update thesis structure with new section
  const updateThesisStructure = (currentThesis: Thesis, newSection: Section, sectionType: SectionType): Thesis => {
    const updatedThesis = { ...currentThesis };
    
    switch(sectionType) {
      case SectionType.GENERAL_INTRODUCTION:
        updatedThesis.generalIntroduction = newSection;
        break;
      case SectionType.GENERAL_CONCLUSION:
        updatedThesis.generalConclusion = newSection;
        break;
      case SectionType.CHAPTER:
        updatedThesis.chapters = [...(updatedThesis.chapters || []), {
          ...newSection,
          sections: [],
          id: sectionId!,
          thesis_id: thesisId!
        }];
        break;
      default:
        updatedThesis.frontMatter = [...(updatedThesis.frontMatter || []), newSection];
    }

    return updatedThesis;
  };

  // Determine section type from URL parameters
  const getSectionTypeFromId = (id: string): SectionType => {
    if (id.includes('general-introduction')) return SectionType.GENERAL_INTRODUCTION;
    if (id.includes('general-conclusion')) return SectionType.GENERAL_CONCLUSION;
    if (id.includes('chapter')) return SectionType.CHAPTER;
    return SectionType.CUSTOM;
  };

  // Content update handler with proper type safety
  const handleContentChange = async (newContent: string) => {
    if (!thesis || !section || !thesisId) return;

    try {
      const updatedThesis = { ...thesis };
      const sectionPath = getSectionPath(section.id);

      if (sectionPath) {
        // Update content using JSON path
        let current: any = updatedThesis;
        sectionPath.forEach(key => {
          if (!current[key]) current[key] = {};
          current = current[key];
        });
        current.content = newContent;

        const { error } = await supabase
          .from('theses')
          .update({ 
            content: updatedThesis.content,
            updated_at: new Date().toISOString()
          })
          .eq('id', thesisId);

        if (error) throw error;

        setThesis(updatedThesis);
        setSection(prev => prev ? { ...prev, content: newContent } : null);
        
        toast({
          title: "Content Updated",
          description: "Changes saved successfully",
        });
      }
    } catch (err) {
      console.error('Update error:', err);
      toast({
        title: "Update Failed",
        description: "Failed to save changes",
        variant: "destructive",
      });
    }
  };

  // Get JSON path for section updates
  const getSectionPath = (targetId: string): string[] | null => {
    const findPath = (sections: Section[], path: string[]): string[] | null => {
      for (const [index, section] of sections.entries()) {
        if (section.id === targetId) return [...path, index.toString()];
        if (section.sections) {
          const nestedPath = findPath(section.sections, [...path, index.toString(), 'sections']);
          if (nestedPath) return nestedPath;
        }
      }
      return null;
    };

    return (
      thesis?.generalIntroduction?.id === targetId ? ['generalIntroduction'] :
      thesis?.generalConclusion?.id === targetId ? ['generalConclusion'] :
      findPath(thesis?.frontMatter || [], ['frontMatter']) ||
      findPath(thesis?.backMatter || [], ['backMatter']) ||
      (() => {
        for (const [chapIdx, chapter] of (thesis?.chapters || []).entries()) {
          const path = findPath(chapter.sections, ['chapters', chapIdx.toString(), 'sections']);
          if (path) return path;
        }
        return null;
      })()
    );
  };

  return (
    <EditorLayout
      sidebar={
        <div className="p-4 space-y-4">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => navigate(`/thesis/${thesisId}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Thesis
          </Button>
        </div>
      }
      content={
        <div className="container mx-auto p-8">
          {isLoading ? (
            <>
              <Skeleton className="h-8 w-64 mb-6" />
              <Skeleton className="h-[500px] w-full" />
            </>
          ) : error ? (
            <Card className="p-6">
              <h1 className="text-2xl font-bold text-destructive">Error</h1>
              <p className="mt-4 text-muted-foreground">{error}</p>
            </Card>
          ) : !section ? (
            <Card className="p-6">
              <h1 className="text-2xl font-bold text-destructive">Section not found</h1>
              <p className="mt-4 text-muted-foreground">
                The requested section could not be found. Please check the URL and try again.
              </p>
            </Card>
          ) : (
            <Card className="p-6">
              <SectionHeader 
                title={section.title} 
                onTitleChange={(newTitle) => {
                  setSection({ ...section, title: newTitle });
                }}
                required={section.required ?? false}
              />
              <div className="mt-6">
                <MarkdownEditor
                  value={section.content}
                  onChange={handleContentChange}
                  placeholder="Start writing your section content..."
                />
              </div>
            </Card>
          )}
        </div>
      }
    />
  );
}