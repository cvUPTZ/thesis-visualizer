import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { useThesisData } from '@/hooks/useThesisData';
import { supabase } from '@/integrations/supabase/client';
import { Section } from '@/types/thesis';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { EditorLayout } from '@/components/editor/layout/EditorLayout';
import { SectionHeader } from '@/components/editor/SectionHeader';
import { ensureThesisStructure, SectionType } from '@/utils/thesisUtils';

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

  // Retry utility function
  const withRetry = async <T,>(operation: () => Promise<T>, maxRetries = 3): Promise<T> => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (err) {
        if (i === maxRetries - 1) throw err;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
    throw new Error('Max retries exceeded');
  };

  useEffect(() => {
    if (!thesis || !sectionId) return;
    
    const loadSection = async () => {
      try {
        setIsLoading(true);
        console.log('Loading section:', { sectionId, thesis });
        const section = await withRetry(() => findSection());
        if (section) {
          console.log('Section found:', section);
          setSection(section);
        }
      } catch (err) {
        console.error('Error loading section:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load section';
        setError(errorMessage);
        toast({
          title: "Error Loading Section",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSection();
  }, [thesis, sectionId]);

  const findSection = async (): Promise<Section | null> => {
    if (!thesis || !sectionId || !thesisId) return null;

    const sectionType = sectionId === 'general-introduction' || thesis.generalIntroduction?.id === sectionId
      ? 'general-introduction'
      : sectionId === 'general-conclusion' || thesis.generalConclusion?.id === sectionId
        ? 'general-conclusion'
        : null;

    if (sectionType) {
      const existingSection = sectionType === 'general-introduction' 
        ? thesis.generalIntroduction 
        : thesis.generalConclusion;

      if (existingSection) return existingSection;

      try {
        const updatedContent = ensureThesisStructure({
          ...thesis,
          metadata: thesis.metadata || {},
          frontMatter: thesis.frontMatter || [],
          generalIntroduction: thesis.generalIntroduction || { 
            id: 'general-introduction', 
            title: 'General Introduction', 
            content: '',
            type: 'general_introduction',
            required: true 
          },
          chapters: thesis.chapters || [],
          generalConclusion: thesis.generalConclusion || { 
            id: 'general-conclusion', 
            title: 'General Conclusion', 
            content: '',
            type: 'general_conclusion',
            required: true 
          },
          backMatter: thesis.backMatter || []
        });

        const { error: updateError } = await supabase
          .from('theses')
          .update({ 
            content: updatedContent,
            updated_at: new Date().toISOString()
          })
          .eq('id', thesisId);

        if (updateError) throw updateError;

        return sectionType === 'general-introduction' 
          ? updatedContent.generalIntroduction 
          : updatedContent.generalConclusion;
      } catch (err) {
        console.error(`Error creating ${sectionType}:`, err);
        throw new Error(`Failed to create ${sectionType}`);
      }
    }

    // Check existing sections
    const existingSection = thesis.frontMatter?.find(s => s.id === sectionId) ||
      thesis.backMatter?.find(s => s.id === sectionId) ||
      thesis.chapters?.flatMap(c => c.sections).find(s => s.id === sectionId);

    if (existingSection) return existingSection;

    // Create new section if not found
    try {
      const { data: newSectionId, error } = await supabase.rpc(
        'create_section_if_not_exists',
        { 
          p_thesis_id: thesisId,
          p_section_title: 'New Section',
          p_section_type: 'custom'
        }
      );

      if (error) throw error;

      const { data: refreshedThesis, error: refreshError } = await supabase
        .from('theses')
        .select('*')
        .eq('id', thesisId)
        .single();

      if (refreshError) throw refreshError;

      if (refreshedThesis) {
        const content = typeof refreshedThesis.content === 'string' 
          ? JSON.parse(refreshedThesis.content) 
          : refreshedThesis.content;

        return content.frontMatter?.find((s: Section) => s.id === newSectionId) || null;
      }
    } catch (err) {
      console.error('Error creating new section:', err);
      throw new Error('Failed to create new section');
    }

    return null;
  };

  const handleContentChange = async (newContent: string) => {
    if (!thesis || !section) return;

    try {
      const updatedThesis = { ...thesis };
      const isGeneralIntro = section.type === 'general_introduction' || sectionId === 'general-introduction';
      const isGeneralConc = section.type === 'general_conclusion' || sectionId === 'general-conclusion';
      
      if (isGeneralIntro) {
        updatedThesis.generalIntroduction = {
          ...thesis.generalIntroduction,
          content: newContent
        };
      } else if (isGeneralConc) {
        updatedThesis.generalConclusion = {
          ...thesis.generalConclusion,
          content: newContent
        };
      } else {
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

      await withRetry(async () => {
        const { error } = await supabase
          .from('theses')
          .update({ 
            content: updatedThesis,
            updated_at: new Date().toISOString()
          })
          .eq('id', thesisId);

        if (error) throw error;
      });

      setThesis(updatedThesis);
      setSection({ ...section, content: newContent });

      toast({
        title: "Success",
        description: "Section content updated successfully",
      });
    } catch (err) {
      console.error('Error updating section:', err);
      toast({
        title: "Error",
        description: "Failed to update section content. Please try again.",
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