import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { useThesisData } from '@/hooks/useThesisData';
import { supabase } from '@/integrations/supabase/client';
import { Section, Thesis } from '@/types/thesis';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { EditorLayout } from '@/components/editor/layout/EditorLayout';
import { SectionHeader } from '@/components/editor/SectionHeader';

export default function SectionEditor() {
  const { thesisId, sectionId } = useParams();
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
      if (!session) {
        navigate('/login');
        return;
      }
    };
    checkAuth();
  }, [navigate]);

  // Initial load and section finding
  useEffect(() => {
    if (!thesis || !sectionId) return;
    
    const loadSection = async () => {
      try {
        setIsLoading(true);
        console.log('Starting to load section:', { thesisId, sectionId });
        console.log('Current thesis state:', JSON.stringify(thesis, null, 2));
        
        const section = await findSection();
        if (section) {
          console.log('Successfully found/created section:', section);
          setSection(section);
        } else {
          throw new Error('Section not found and could not be created');
        }
      } catch (err) {
        console.error('Error in loadSection:', err);
        setError(err instanceof Error ? err.message : 'Failed to load section');
        toast({
          title: "Error Loading Section",
          description: err instanceof Error ? err.message : 'Failed to load section',
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSection();
  }, [thesis, sectionId]);

  const ensureThesisStructure = (thesis: Thesis): Thesis => {
    const baseStructure = {
      metadata: {},
      frontMatter: [],
      generalIntroduction: {
        id: 'general-introduction',
        title: 'General Introduction',
        content: '',
        type: 'general_introduction',
        required: true
      },
      chapters: [],
      generalConclusion: {
        id: 'general-conclusion',
        title: 'General Conclusion',
        content: '',
        type: 'general_conclusion',
        required: true
      },
      backMatter: []
    };

    const result = {
      ...baseStructure,
      ...thesis,
      metadata: { ...baseStructure.metadata, ...thesis.metadata },
      frontMatter: Array.isArray(thesis.frontMatter) ? thesis.frontMatter : baseStructure.frontMatter,
      generalIntroduction: thesis.generalIntroduction || baseStructure.generalIntroduction,
      chapters: Array.isArray(thesis.chapters) ? thesis.chapters : baseStructure.chapters,
      generalConclusion: thesis.generalConclusion || baseStructure.generalConclusion,
      backMatter: Array.isArray(thesis.backMatter) ? thesis.backMatter : baseStructure.backMatter
    };

    console.log('Ensured thesis structure:', JSON.stringify(result, null, 2));
    return result;
  };

  const findSection = async (): Promise<Section | null> => {
    if (!thesis || !sectionId || !thesisId) {
      console.log('Missing required parameters:', { hasThesis: !!thesis, sectionId, thesisId });
      return null;
    }

    // Look for existing section first
    const existingSection = findExistingSection(thesis, sectionId);
    if (existingSection) {
      console.log('Found existing section:', existingSection);
      return existingSection;
    }

    // If not found, ensure thesis structure and create new section
    try {
      const completeThesis = ensureThesisStructure(thesis);
      
      // Update thesis with complete structure
      console.log('Updating thesis with complete structure...');
      const { error: updateError } = await supabase
        .from('theses')
        .update({ 
          content: completeThesis,
          updated_at: new Date().toISOString()
        })
        .eq('id', thesisId);

      if (updateError) {
        console.error('Error updating thesis structure:', updateError);
        throw updateError;
      }

      // Create new section
      console.log('Creating new section...');
      const { data: newSectionId, error: createError } = await supabase.rpc(
        'create_section_if_not_exists',
        { 
          p_thesis_id: thesisId,
          p_section_title: 'New Section',
          p_section_type: 'custom'
        }
      );

      if (createError) {
        console.error('Error creating new section:', createError);
        throw createError;
      }

      // Fetch updated thesis
      console.log('Fetching updated thesis...');
      const { data: refreshedThesis, error: refreshError } = await supabase
        .from('theses')
        .select('*')
        .eq('id', thesisId)
        .single();

      if (refreshError) throw refreshError;

      if (!refreshedThesis) {
        throw new Error('Failed to fetch updated thesis');
      }

      const content = typeof refreshedThesis.content === 'string' 
        ? JSON.parse(refreshedThesis.content) 
        : refreshedThesis.content;

      const newSection = findExistingSection(content, newSectionId);
      if (!newSection) {
        throw new Error('New section not found in updated thesis');
      }

      return newSection;
    } catch (err) {
      console.error('Error in section creation process:', err);
      throw new Error(`Failed to create new section: ${err.message}`);
    }
  };

  const findExistingSection = (thesis: Thesis, targetId: string): Section | null => {
    // Check special sections
    if (thesis.generalIntroduction?.id === targetId) return thesis.generalIntroduction;
    if (thesis.generalConclusion?.id === targetId) return thesis.generalConclusion;

    // Check front matter
    const frontMatterSection = thesis.frontMatter?.find(s => s.id === targetId);
    if (frontMatterSection) return frontMatterSection;

    // Check back matter
    const backMatterSection = thesis.backMatter?.find(s => s.id === targetId);
    if (backMatterSection) return backMatterSection;

    // Check chapters
    for (const chapter of thesis.chapters || []) {
      const chapterSection = chapter.sections.find(s => s.id === targetId);
      if (chapterSection) return chapterSection;
    }

    return null;
  };

  const handleContentChange = async (newContent: string) => {
    if (!thesis || !section || !thesisId) return;

    try {
      console.log('Handling content change...');
      const updatedThesis = { ...thesis };

      // Update the appropriate section
      if (section.type === 'general_introduction') {
        updatedThesis.generalIntroduction = {
          ...updatedThesis.generalIntroduction,
          content: newContent
        };
      } else if (section.type === 'general_conclusion') {
        updatedThesis.generalConclusion = {
          ...updatedThesis.generalConclusion,
          content: newContent
        };
      } else {
        // Update in front/back matter or chapters
        const frontMatterIndex = thesis.frontMatter?.findIndex(s => s.id === section.id) ?? -1;
        if (frontMatterIndex !== -1) {
          updatedThesis.frontMatter[frontMatterIndex] = {
            ...thesis.frontMatter[frontMatterIndex],
            content: newContent
          };
        } else {
          updatedThesis.chapters = (thesis.chapters || []).map(chapter => ({
            ...chapter,
            sections: chapter.sections.map(s => 
              s.id === section.id ? { ...s, content: newContent } : s
            )
          }));
        }
      }

      // Ensure complete structure before saving
      const completeThesis = ensureThesisStructure(updatedThesis);

      console.log('Saving updated thesis...');
      const { error } = await supabase
        .from('theses')
        .update({ 
          content: completeThesis,
          updated_at: new Date().toISOString()
        })
        .eq('id', thesisId);

      if (error) throw error;

      setThesis(completeThesis);
      setSection({ ...section, content: newContent });

      toast({
        title: "Success",
        description: "Content updated successfully",
      });
    } catch (err) {
      console.error('Error updating content:', err);
      toast({
        title: "Error",
        description: "Failed to update content. Please try again.",
        variant: "destructive",
      });
    }
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
                required={section.required}
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