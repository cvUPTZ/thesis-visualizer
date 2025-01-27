import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { useThesisData } from '@/hooks/useThesisData';
import { supabase } from '@/integrations/supabase/client';
import { Section } from '@/types/thesis';
import { Skeleton } from '@/components/ui/skeleton';
import { validate as validateUUID } from 'uuid';

export default function SectionEditor() {
  const { thesisId, sectionId } = useParams();
  const { thesis, setThesis } = useThesisData(thesisId);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [section, setSection] = useState<Section | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!thesis || !sectionId) return;
    
    const loadSection = async () => {
      try {
        setIsLoading(true);
        
        // Validate UUID format
        if (!validateUUID(sectionId)) {
          throw new Error('Invalid section ID format');
        }

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
    if (!thesis || !sectionId || !validateUUID(sectionId)) return null;

    // Check if it's the general introduction
    if (thesis.generalIntroduction?.id === sectionId) {
      return thesis.generalIntroduction;
    }

    // Check if it's the general conclusion
    if (thesis.generalConclusion?.id === sectionId) {
      return thesis.generalConclusion;
    }

    // Check front matter
    const frontMatterSection = thesis.frontMatter?.find(s => s.id === sectionId);
    if (frontMatterSection) return frontMatterSection;

    // Check back matter
    const backMatterSection = thesis.backMatter?.find(s => s.id === sectionId);
    if (backMatterSection) return backMatterSection;

    // Check chapters
    if (thesis.chapters) {
      for (const chapter of thesis.chapters) {
        if (chapter.sections) {
          const section = chapter.sections.find(s => s.id === sectionId);
          if (section) return section;
        }
      }
    }

    // If section not found, try to create it
    try {
      console.log('Creating new section for:', { thesisId, sectionId });
      const { data: newSection, error } = await supabase.rpc(
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

      return newSection;
    } catch (err) {
      console.error('Error creating section:', err);
      throw new Error('Failed to create new section');
    }
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
        const frontMatterIndex = thesis.frontMatter?.findIndex(s => s.id === section.id);
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
          value={section.content as string}
          onChange={handleContentChange}
          placeholder="Start writing your section content..."
        />
      </Card>
    </div>
  );
}