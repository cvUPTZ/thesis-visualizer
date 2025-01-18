import React from 'react';
import { useParams } from 'react-router-dom';
import { Chapter, Section } from '@/types/thesis';
import { ThesisContentManager } from './ThesisContentManager';

interface ThesisEditorContentProps {
  frontMatter: Section[];
  chapters: Chapter[];
  backMatter: Section[];
  activeSection: string;
  onContentChange: (id: string, content: string) => void;
  onTitleChange: (id: string, title: string) => void;
  onUpdateChapter: (chapter: Chapter) => void;
  onAddChapter: (chapter: Chapter) => void;
  hasGeneralIntroduction?: boolean;
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
  hasGeneralIntroduction = false
}) => {
  const { thesisId } = useParams<{ thesisId: string }>();

  if (!thesisId) {
    return null;
  }

  return (
    <ThesisContentManager
      frontMatter={frontMatter}
      chapters={chapters}
      backMatter={backMatter}
      activeSection={activeSection}
      onContentChange={onContentChange}
      onTitleChange={onTitleChange}
      onUpdateChapter={onUpdateChapter}
      onAddChapter={onAddChapter}
      thesisId={thesisId}
      hasGeneralIntroduction={hasGeneralIntroduction}
    />
  );
};