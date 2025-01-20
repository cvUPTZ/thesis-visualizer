import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { useThesisData } from '@/hooks/useThesisData';
import { supabase } from '@/integrations/supabase/client';
import { Section } from '@/types/thesis';
import { Skeleton } from '@/components/ui/skeleton';

export default function SectionEditor() {
  const { thesisId, sectionId } = useParams();
  const { thesis, setThesis } = useThesisData(thesisId);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [section, setSection] = useState<Section | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!thesis || !sectionId) return;
    
    const loadSection = async () => {
      try {
        setIsLoading(true);
        const section = await findSection();
        if (section) {
          setSection(section);
        }
      } catch (err) {
        console.error('Error loading section:', err);
        setError(err instanceof Error ? err.message : 'Failed to load section');
        toast({
          title: "Error",
          description: "Failed to load section. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadSection();
  }, [thesis, sectionId]);

  const findSection = async (): Promise<Section | null> => {
    if (!thesis || !sectionId) return null;

    // Check if it's the general introduction
    if (thesis.generalIntroduction?.id === sectionId || sectionId === 'general-introduction') {
      return thesis.generalIntroduction || null;
    }

    // Check if it's the general conclusion
    if (thesis.generalConclusion?.id === sectionId || sectionId === 'general-conclusion') {
      return thesis.generalConclusion || null;
    }

    // Check front matter
    const frontMatterSection = thesis.frontMatter.find(s => s.id === sectionId);
    if (frontMatterSection) return frontMatterSection;

    // Check back matter
    const backMatterSection = thesis.backMatter.find(s => s.id === sectionId);
    if (backMatterSection) return backMatterSection;

    // Check chapters
    for (const chapter of thesis.chapters) {
      const section = chapter.sections.find(s => s.id === sectionId);
      if (section) return section;
    }

    // If section not found, try to create it
    try {
      console.log('Creating new section for:', { thesisId, sectionId });
      const { data: newSectionId, error } = await supabase.rpc(
        'create_section_if_not_exists',
        { 
          p_thesis_id: thesisId,
          p_section_title: 'New Section',
          p_section_type: 'custom'
        }
      );

      if (error) {
        console.error('Error creating section:', error);
        throw error;
      }

      // Refresh thesis data to get the new section
      const { data: updatedThesis, error: thesisError } = await supabase
        .from('theses')
        .select('*')
        .eq('id', thesisId)
        .single();

      if (thesisError) throw thesisError;

      if (updatedThesis) {
        const content = typeof updatedThesis.content === 'string' 
          ? JSON.parse(updatedThesis.content) 
          : updatedThesis.content;

        // Find the newly created section
        const newSection = content.frontMatter?.find((s: Section) => s.id === newSectionId);
        if (newSection) {
          return newSection;
        }
      }
    } catch (err) {
      console.error('Error creating section:', err);
      throw new Error('Failed to create new section');
    }

    return null;
  };

  const handleContentChange = async (newContent: string) => {
    if (!thesis || !section) return;

    try {
      const updatedThesis = { ...thesis };
      
      // Update the appropriate section based on its location
      if (section.id === thesis.generalIntroduction?.id) {
        updatedThesis.generalIntroduction = {
          ...thesis.generalIntroduction,
          content: newContent
        };
      } else if (section.id === thesis.generalConclusion?.id) {
        updatedThesis.generalConclusion = {
          ...thesis.generalConclusion,
          content: newContent
        };
      } else {
        // Update in front matter or chapters
        const frontMatterIndex = thesis.frontMatter.findIndex(s => s.id === section.id);
        if (frontMatterIndex !== -1) {
          updatedThesis.frontMatter[frontMatterIndex] = {
            ...thesis.frontMatter[frontMatterIndex],
            content: newContent
          };
        } else {
          updatedThesis.chapters = thesis.chapters.map(chapter => ({
            ...chapter,
            sections: chapter.sections.map(s => 
              s.id === section.id ? { ...s, content: newContent } : s
            )
          }));
        }
      }

      setThesis(updatedThesis);
      setSection({ ...section, content: newContent });

      toast({
        title: "Success",
        description: "Section content updated",
      });
    } catch (err) {
      console.error('Error updating section:', err);
      toast({
        title: "Error",
        description: "Failed to update section content",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-8">
        <Card className="p-6">
          <h1 className="text-2xl font-bold text-destructive">Error</h1>
          <p className="mt-4 text-muted-foreground">{error}</p>
        </Card>
      </div>
    );
  }

  if (!section) {
    return (
      <div className="container mx-auto p-8">
        <Card className="p-6">
          <h1 className="text-2xl font-bold text-destructive">Section not found</h1>
          <p className="mt-4 text-muted-foreground">
            The requested section could not be found. Please check the URL and try again.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">{section.title}</h1>
        <MarkdownEditor
          value={section.content}
          onChange={handleContentChange}
          placeholder="Start writing your section content..."
        />
      </Card>
    </div>
  );
}