import React from 'react';
import { ThesisContent } from '../ThesisContent';
import { Chapter, Section } from '@/types/thesis';
import { useParams } from 'react-router-dom';

interface ThesisEditorContentProps {
  frontMatter: Section[];
  chapters: Chapter[];
  backMatter: Section[];
  activeSection: string;
  onContentChange: (id: string, content: string) => void;
  onTitleChange: (id: string, title: string) => void;
  onUpdateChapter: (chapter: Chapter) => void;
  onAddChapter: (chapter: Chapter) => void;
}

export const ThesisEditorContent: React.FC<ThesisEditorContentProps> = ({
  frontMatter,
  chapters,
  backMatter,
  activeSection,
  onContentChange,
  onTitleChange,
  onUpdateChapter,
  onAddChapter
}) => {
  const { thesisId } = useParams<{ thesisId: string }>();

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
      thesisId={thesisId || ''}
    />
  );
};