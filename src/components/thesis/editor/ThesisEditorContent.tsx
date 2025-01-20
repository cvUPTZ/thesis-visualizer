import React from 'react';
import { ThesisContent } from '../ThesisContent';
import { Chapter, Section, Thesis } from '@/types/thesis';

interface ThesisEditorContentProps {
  frontMatter: Section[];
  chapters: Chapter[];
  backMatter: Section[];
  activeSection: string;
  onContentChange: (id: string, content: string) => void;
  onTitleChange: (id: string, title: string) => void;
  onUpdateChapter: (chapter: Chapter) => void;
  onAddChapter: (chapter: Chapter) => void;
  thesis: Thesis;
  onUpdateThesis: (thesis: Thesis) => void;
}

export const ThesisEditorContent: React.FC<ThesisEditorContentProps> = ({
  frontMatter,
  chapters,
  backMatter,
  activeSection,
  onContentChange,
  onTitleChange,
  onUpdateChapter,
  onAddChapter,
  thesis,
  onUpdateThesis
}) => {
  console.log('ThesisEditorContent rendering with thesis:', thesis);

  return (
    <ThesisContent
      frontMatter={frontMatter}
      chapters={chapters}
      backMatter={backMatter}
      activeSection={activeSection}
      onContentChange={onContentChange}
      onTitleChange={onTitleChange}
      onUpdateChapter={onUpdateChapter}
      onAddChapter={onAddChapter}
      thesis={thesis}
      onUpdateThesis={onUpdateThesis}
      thesisId={thesis.id}
    />
  );
};