import React from 'react';
import { EditorSection } from '../EditorSection';
import { ChapterManager } from '../ChapterManager';
import { Chapter, Section } from '@/types/thesis';

interface ThesisContentProps {
  frontMatter: Section[];
  chapters: Chapter[];
  backMatter: Section[];
  activeSection: string;
  onContentChange: (id: string, content: string) => void;
  onTitleChange: (id: string, title: string) => void;
  onUpdateChapter: (chapter: Chapter) => void;
  onAddChapter: () => void;
}

export const ThesisContent = ({
  frontMatter,
  chapters,
  backMatter,
  activeSection,
  onContentChange,
  onTitleChange,
  onUpdateChapter,
  onAddChapter
}: ThesisContentProps) => {
  return (
    <div className="space-y-6">
      {frontMatter.map(section => (
        <EditorSection
          key={section.id}
          section={section}
          isActive={activeSection === section.id}
          onContentChange={onContentChange}
          onTitleChange={onTitleChange}
        />
      ))}
      <ChapterManager
        chapters={chapters}
        onUpdateChapter={onUpdateChapter}
        onAddChapter={onAddChapter}
      />
      {backMatter.map(section => (
        <EditorSection
          key={section.id}
          section={section}
          isActive={activeSection === section.id}
          onContentChange={onContentChange}
          onTitleChange={onTitleChange}
        />
      ))}
    </div>
  );
};