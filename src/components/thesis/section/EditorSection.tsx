import React from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { useThesisData } from '@/hooks/useThesisData';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Thesis } from '@/types/thesis';

export default function SectionEditor() {
  const { thesisId, sectionId } = useParams();
  const { thesis, setThesis, isLoading } = useThesisData(thesisId);
  const { toast } = useToast();

  console.log('SectionEditor rendering:', { thesisId, sectionId });

  if (isLoading) {
    return (
      <div className="container mx-auto p-8">
        <Skeleton className="h-8 w-64 mb-6" />
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  if (!thesis) return null;

  const findSection = async () => {
    // Check if it's the general introduction
    if (thesis.generalIntroduction?.id === sectionId || sectionId === 'general-introduction') {
      return thesis.generalIntroduction;
    }

    // Check if it's the general conclusion
    if (thesis.generalConclusion?.id === sectionId || sectionId === 'general-conclusion') {
      return thesis.generalConclusion;
    }

    // Check front matter
    const frontMatterSection = thesis.frontMatter.find(s => 
      s.id === sectionId || s.title.toLowerCase() === sectionId?.toLowerCase()
    );
    if (frontMatterSection) return frontMatterSection;

    // Check back matter
    const backMatterSection = thesis.backMatter.find(s => 
      s.id === sectionId || s.title.toLowerCase() === sectionId?.toLowerCase()
    );
    if (backMatterSection) return backMatterSection;

    // Check chapters
    for (const chapter of thesis.chapters) {
      const section = chapter.sections.find(s => 
        s.id === sectionId || s.title.toLowerCase() === sectionId?.toLowerCase()
      );
      if (section) return section;
    }

    // If section not found, create it
    try {
      const { data: newSectionId, error } = await supabase.rpc(
        'create_section_if_not_exists',
        { 
          p_thesis_id: thesisId,
          p_section_title: sectionId || 'New Section',
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

      const parsedContent = typeof updatedThesis.content === 'string'
        ? JSON.parse(updatedThesis.content)
        : updatedThesis.content;

      const formattedThesis: Thesis = {
        ...updatedThesis,
        metadata: parsedContent.metadata || {
          description: '',
          keywords: [],
          createdAt: new Date().toISOString(),
          universityName: '',
          departmentName: '',
          authorName: '',
          thesisDate: '',
          committeeMembers: []
        },
        frontMatter: parsedContent.frontMatter || [],
        chapters: parsedContent.chapters || [],
        backMatter: parsedContent.backMatter || [],
        generalIntroduction: parsedContent.generalIntroduction,
        generalConclusion: parsedContent.generalConclusion
      };

      setThesis(formattedThesis);
      
      toast({
        title: "Section Created",
        description: `Created new section: ${sectionId}`,
      });

      // Find the newly created section in the updated thesis
      const newSection = formattedThesis.frontMatter.find(
        (s) => s.id === newSectionId
      );

      return newSection;
    } catch (error: any) {
      console.error('Error creating section:', error);
      toast({
        title: "Error",
        description: "Failed to create section. Please try again.",
        variant: "destructive",
      });
      return null;
    }
  };

  const section = findSection();

  if (!section) {
    return (
      <div className="container mx-auto p-8">
        <Card className="p-6">
          <h1 className="text-2xl font-bold text-destructive">Creating Section...</h1>
          <p className="mt-4 text-muted-foreground">
            Please wait while we set up your new section.
          </p>
        </Card>
      </div>
    );
  }

  const handleContentChange = (newContent: string) => {
    const updatedThesis = { ...thesis };
    
    // Update general introduction
    if (thesis.generalIntroduction?.id === sectionId || sectionId === 'general-introduction') {
      updatedThesis.generalIntroduction = {
        ...thesis.generalIntroduction!,
        content: newContent
      };
    }
    // Update general conclusion
    else if (thesis.generalConclusion?.id === sectionId || sectionId === 'general-conclusion') {
      updatedThesis.generalConclusion = {
        ...thesis.generalConclusion!,
        content: newContent
      };
    }
    // Update front matter
    else {
      const frontMatterIndex = thesis.frontMatter.findIndex(s => s.id === sectionId);
      if (frontMatterIndex !== -1) {
        updatedThesis.frontMatter[frontMatterIndex] = {
          ...thesis.frontMatter[frontMatterIndex],
          content: newContent
        };
      }

      // Update back matter
      const backMatterIndex = thesis.backMatter.findIndex(s => s.id === sectionId);
      if (backMatterIndex !== -1) {
        updatedThesis.backMatter[backMatterIndex] = {
          ...thesis.backMatter[backMatterIndex],
          content: newContent
        };
      }

      // Update chapters
      updatedThesis.chapters = thesis.chapters.map(chapter => ({
        ...chapter,
        sections: chapter.sections.map(s => 
          s.id === sectionId ? { ...s, content: newContent } : s
        )
      }));
    }

    setThesis(updatedThesis);
    toast({
      title: "Success",
      description: "Section content updated",
    });
  };

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