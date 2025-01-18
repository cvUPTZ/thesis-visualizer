import React from 'react';
import { Chapter, Section } from '@/types/thesis';
import { ThesisContent } from '../ThesisContent';

interface ThesisContentManagerProps {
  frontMatter: Section[];
  chapters: Chapter[];
  backMatter: Section[];
  activeSection: string;
  onContentChange: (id: string, content: string) => void;
  onTitleChange: (id: string, title: string) => void;
  onUpdateChapter: (chapter: Chapter) => void;
  onAddChapter: (chapter: Chapter) => void;
  thesisId: string;
  hasGeneralIntroduction: boolean;
}

export const ThesisContentManager: React.FC<ThesisContentManagerProps> = ({
  frontMatter,
  chapters,
  backMatter,
  activeSection,
  onContentChange,
  onTitleChange,
  onUpdateChapter,
  onAddChapter,
  thesisId,
  hasGeneralIntroduction
}) => {
  console.log('🔄 ThesisContentManager rendering with:', { 
    frontMatterCount: frontMatter.length,
    chaptersCount: chapters.length,
    backMatterCount: backMatter.length,
    hasGeneralIntroduction 
  });

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
      thesisId={thesisId}
      hasGeneralIntroduction={hasGeneralIntroduction}
    />
  );
};