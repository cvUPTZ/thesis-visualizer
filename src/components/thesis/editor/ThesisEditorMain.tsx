import React from 'react';
import { ThesisEditorContent } from './ThesisEditorContent';
import { ThesisEditorPreview } from './ThesisEditorPreview';
import { Chapter, Thesis } from '@/types/thesis';
import { Card } from '@/components/ui/card';
import { MarkdownEditor } from '@/components/MarkdownEditor';

interface ThesisEditorMainProps {
  thesis: Thesis | null;
  activeSection: string;
  showPreview: boolean;
  previewRef: React.RefObject<HTMLDivElement>;
  onContentChange: (id: string, content: string) => void;
  onTitleChange: (id: string, title: string) => void;
  onUpdateChapter: (chapter: Chapter) => void;
  onAddChapter: (chapter: Chapter) => void;
}

export const ThesisEditorMain: React.FC<ThesisEditorMainProps> = ({
  thesis,
  activeSection,
  showPreview,
  previewRef,
  onContentChange,
  onTitleChange,
  onUpdateChapter,
  onAddChapter
}) => {
  console.log('ThesisEditorMain rendering with:', { 
    hasThesis: !!thesis, 
    activeSection,
    showPreview 
  });

  return (
    <main className="flex-1 p-8 flex">
      <div className={`transition-all duration-300 ${showPreview ? 'w-1/2' : 'w-full'}`}>
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-serif font-medium mb-4">General Introduction</h2>
            <p className="text-muted-foreground mb-4">
              Provide a high-level overview of your thesis. This section should introduce your research topic,
              objectives, and the structure of your thesis.
            </p>
            <MarkdownEditor
              value={thesis?.content?.generalIntroduction || ''}
              onChange={(value) => {
                if (thesis) {
                  onContentChange('generalIntroduction', value || '');
                }
              }}
              placeholder="Start writing your general introduction..."
            />
          </Card>

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
      </div>
      {showPreview && thesis && (
        <div className="w-1/2 pl-8 border-l">
          <ThesisEditorPreview thesis={thesis} previewRef={previewRef} />
        </div>
      )}
    </main>
  );
};