import React from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { useThesisData } from '@/hooks/useThesisData';

export default function SectionEditor() {
  const { thesisId, sectionId } = useParams();
  const { thesis, setThesis } = useThesisData(thesisId);
  const { toast } = useToast();

  console.log('SectionEditor rendering:', { thesisId, sectionId });

  if (!thesis) return null;

  const findSection = () => {
    if (thesis.generalIntroduction?.id === sectionId) {
      return thesis.generalIntroduction;
    }
    if (thesis.generalConclusion?.id === sectionId) {
      return thesis.generalConclusion;
    }
    const frontMatterSection = thesis.frontMatter.find(s => s.id === sectionId);
    if (frontMatterSection) return frontMatterSection;

    const backMatterSection = thesis.backMatter.find(s => s.id === sectionId);
    if (backMatterSection) return backMatterSection;

    for (const chapter of thesis.chapters) {
      const section = chapter.sections.find(s => s.id === sectionId);
      if (section) return section;
    }
    return null;
  };

  const section = findSection();

  if (!section) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Section not found</h1>
      </div>
    );
  }

  const handleContentChange = (newContent: string) => {
    const updatedThesis = { ...thesis };
    
    if (thesis.generalIntroduction?.id === sectionId) {
      updatedThesis.generalIntroduction = {
        ...thesis.generalIntroduction,
        content: newContent
      };
    } else if (thesis.generalConclusion?.id === sectionId) {
      updatedThesis.generalConclusion = {
        ...thesis.generalConclusion,
        content: newContent
      };
    } else {
      // Update in frontMatter
      const frontMatterIndex = thesis.frontMatter.findIndex(s => s.id === sectionId);
      if (frontMatterIndex !== -1) {
        updatedThesis.frontMatter[frontMatterIndex] = {
          ...thesis.frontMatter[frontMatterIndex],
          content: newContent
        };
      }

      // Update in backMatter
      const backMatterIndex = thesis.backMatter.findIndex(s => s.id === sectionId);
      if (backMatterIndex !== -1) {
        updatedThesis.backMatter[backMatterIndex] = {
          ...thesis.backMatter[backMatterIndex],
          content: newContent
        };
      }

      // Update in chapters
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