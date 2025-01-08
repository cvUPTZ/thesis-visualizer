import React from 'react';
import { ThesisEditorContent } from './ThesisEditorContent';
import { Chapter, Thesis } from '@/types/thesis';

interface ThesisEditorMainProps {
  thesis: Thesis | null;
  activeSection: string;
  onContentChange: (id: string, content: string) => void;
  onTitleChange: (id: string, title: string) => void;
  onUpdateChapter: (chapter: Chapter) => void;
  onAddChapter: (chapter: Chapter) => void;
}

export const ThesisEditorMain: React.FC<ThesisEditorMainProps> = ({
  thesis,
  activeSection,
  onContentChange,
  onTitleChange,
  onUpdateChapter,
  onAddChapter
}) => {
  return (
    <main className="flex-1 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <ThesisEditorContent
          frontMatter={thesis?.frontMatter || []}
          chapters={thesis?.chapters || []}
          backMatter={thesis?.backMatter || []}
          activeSection={activeSection}
          onContentChange={onContentChange}
          onTitleChange={onTitleChange}
          onUpdateChapter={onUpdateChapter}
          onAddChapter={onAddChapter}
        />
      </div>
    </main>
  );
};