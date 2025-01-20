import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { useThesisData } from '@/hooks/useThesisData';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Section } from '@/types/thesis';

export default function EditorSection() {
  const { thesisId, sectionId } = useParams();
  const { thesis, setThesis, isLoading } = useThesisData(thesisId);
  const { toast } = useToast();
  const [section, setSection] = useState<Section | null>(null);
  const [isLoadingSection, setIsLoadingSection] = useState(true);

  useEffect(() => {
    const loadSection = async () => {
      if (!thesis || !sectionId) return;
      
      try {
        setIsLoadingSection(true);
        const foundSection = await findSection();
        if (foundSection) {
          setSection(foundSection);
        }
      } catch (error) {
        console.error('Error loading section:', error);
        toast({
          title: "Error",
          description: "Failed to load section. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingSection(false);
      }
    };

    loadSection();
  }, [thesis, sectionId]);

  if (isLoading || !thesis) {
    return (
      <div className="container mx-auto p-8">
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  const findSection = async (): Promise<Section | null> => {
    if (!thesis || !sectionId) return null;

    // Check if it's the general introduction
    if (thesis.generalIntroduction?.id === sectionId || sectionId === 'general-introduction') {
      return thesis.generalIntroduction;
    }

    // Check if it's the general conclusion
    if (thesis.generalConclusion?.id === sectionId || sectionId === 'general-conclusion') {
      return thesis.generalConclusion;
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

    // If section not found, create it
    try {
      const { data: newSectionId, error } = await supabase.rpc(
        'create_section_if_not_exists',
        { 
          p_thesis_id: thesisId,
          p_section_title: sectionId,
          p_section_type: 'custom'
        }
      );

      if (error) throw error;

      // Refresh thesis data to get the new section
      const { data: updatedThesis, error: thesisError } = await supabase
        .from('theses')
        .select('*')
        .eq('id', thesisId)
        .single();

      if (thesisError) throw thesisError;

      if (updatedThesis) {
        setThesis(updatedThesis);
        const newSection = thesis.frontMatter.find(s => s.id === newSectionId);
        return newSection || null;
      }
    } catch (error: any) {
      console.error('Error creating section:', error);
      toast({
        title: "Error",
        description: "Failed to create section. Please try again.",
        variant: "destructive",
      });
    }

    return null;
  };

  const handleContentChange = (newContent: string) => {
    if (!thesis || !section) return;
    
    const updatedThesis = { ...thesis };
    
    // Update general introduction
    if (thesis.generalIntroduction?.id === section.id || sectionId === 'general-introduction') {
      updatedThesis.generalIntroduction = {
        ...thesis.generalIntroduction!,
        content: newContent
      };
    }
    // Update general conclusion
    else if (thesis.generalConclusion?.id === section.id || sectionId === 'general-conclusion') {
      updatedThesis.generalConclusion = {
        ...thesis.generalConclusion!,
        content: newContent
      };
    }
    // Update other sections
    else {
      const frontMatterIndex = thesis.frontMatter.findIndex(s => s.id === section.id);
      if (frontMatterIndex !== -1) {
        updatedThesis.frontMatter[frontMatterIndex] = {
          ...thesis.frontMatter[frontMatterIndex],
          content: newContent
        };
      }

      const backMatterIndex = thesis.backMatter.findIndex(s => s.id === section.id);
      if (backMatterIndex !== -1) {
        updatedThesis.backMatter[backMatterIndex] = {
          ...thesis.backMatter[backMatterIndex],
          content: newContent
        };
      }

      updatedThesis.chapters = thesis.chapters.map(chapter => ({
        ...chapter,
        sections: chapter.sections.map(s => 
          s.id === section.id ? { ...s, content: newContent } : s
        )
      }));
    }

    setThesis(updatedThesis);
    toast({
      title: "Success",
      description: "Section content updated",
    });
  };

  if (isLoadingSection) {
    return (
      <div className="container mx-auto p-8">
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-[500px] w-full" />
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