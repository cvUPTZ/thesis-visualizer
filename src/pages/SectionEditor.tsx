import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { useThesisData } from '@/hooks/useThesisData';

export default function SectionEditor() {
  const { thesisId, sectionId } = useParams();
  const { thesis, setThesis, isLoading, error } = useThesisData(thesisId);
  const { toast } = useToast();
  const navigate = useNavigate();

  console.log('SectionEditor rendering:', { thesisId, sectionId });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load thesis data",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  if (!thesis || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  const findSection = () => {
    // Check general introduction
    if (thesis.generalIntroduction?.id === sectionId || sectionId === 'general-introduction') {
      return thesis.generalIntroduction;
    }

    // Check general conclusion
    if (thesis.generalConclusion?.id === sectionId || sectionId === 'general-conclusion') {
      return thesis.generalConclusion;
    }

    // Check front matter
    const frontMatterSection = thesis.frontMatter?.find(s => s.id === sectionId);
    if (frontMatterSection) return frontMatterSection;

    // Check chapters
    for (const chapter of thesis.chapters || []) {
      const section = chapter.sections?.find(s => s.id === sectionId);
      if (section) return section;
    }

    // Check back matter
    const backMatterSection = thesis.backMatter?.find(s => s.id === sectionId);
    if (backMatterSection) return backMatterSection;

    return null;
  };

  const section = findSection();

  if (!section) {
    return (
      <div className="p-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate(`/thesis/${thesisId}`)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Thesis
        </Button>
        <Card className="p-6">
          <h1 className="text-2xl font-bold text-destructive">Section not found</h1>
          <p className="mt-4 text-muted-foreground">
            The requested section could not be found. Please check the URL and try again.
          </p>
        </Card>
      </div>
    );
  }

  const handleContentChange = (newContent: string) => {
    if (!thesis) return;

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
      const frontMatterIndex = thesis.frontMatter?.findIndex(s => s.id === sectionId);
      if (frontMatterIndex !== -1) {
        updatedThesis.frontMatter[frontMatterIndex] = {
          ...thesis.frontMatter[frontMatterIndex],
          content: newContent
        };
      }

      // Update chapters
      updatedThesis.chapters = (thesis.chapters || []).map(chapter => ({
        ...chapter,
        sections: (chapter.sections || []).map(s => 
          s.id === sectionId ? { ...s, content: newContent } : s
        )
      }));

      // Update back matter
      const backMatterIndex = thesis.backMatter?.findIndex(s => s.id === sectionId);
      if (backMatterIndex !== -1) {
        updatedThesis.backMatter[backMatterIndex] = {
          ...thesis.backMatter[backMatterIndex],
          content: newContent
        };
      }
    }

    setThesis(updatedThesis);
    toast({
      title: "Success",
      description: "Section content updated",
    });
  };

  return (
    <div className="container mx-auto p-8">
      <Button 
        variant="ghost" 
        onClick={() => navigate(`/thesis/${thesisId}`)}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Thesis
      </Button>
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