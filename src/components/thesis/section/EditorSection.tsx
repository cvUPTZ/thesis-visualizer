// import React from 'react';
// import { cn } from '@/lib/utils';

// interface EditorSectionProps {
//   children: React.ReactNode;
//   className?: string;
// }

// export const EditorSection = ({ children, className }: EditorSectionProps) => {
//   return (
//     <div className={cn(
//       "bg-editor-bg border border-editor-border rounded-lg p-6 mb-6",
//       "shadow-lg transition-all duration-200 hover:shadow-xl",
//       "backdrop-blur-sm backdrop-filter",
//       className
//     )}>
//       {children}
//     </div>
//   );
// };

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

    return null;
  };

  const section = findSection();

  if (!section) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-500">Section not found</h1>
        <p className="mt-4 text-gray-600">The requested section could not be found. Please check the URL and try again.</p>
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