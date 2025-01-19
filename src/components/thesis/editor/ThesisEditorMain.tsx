import React from 'react';
import { ThesisEditorContent } from './ThesisEditorContent';
import { ThesisEditorPreview } from './ThesisEditorPreview';
import { Chapter, Section, Thesis } from '@/types/thesis';
import { useToast } from '@/hooks/use-toast';

interface ThesisEditorMainProps {
  thesis: Thesis | null;
  activeSection: string;
  showPreview: boolean;
  previewRef: React.RefObject<HTMLDivElement>;
  onContentChange: (id: string, content: string) => void;
  onTitleChange: (id: string, title: string) => void;
  onUpdateChapter: (chapter: Chapter) => Promise<void>;
  onAddChapter: (chapter: Chapter) => Promise<void>;
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
  const { toast } = useToast();

  return (
    <main className="flex-1 p-8 flex">
      <div className={`transition-all duration-300 ${showPreview ? 'w-1/2' : 'w-full'}`}>
        <div className="max-w-4xl mx-auto space-y-6">
          {thesis && (
            <ThesisEditorContent
              frontMatter={thesis?.frontMatter || []}
              chapters={thesis?.chapters || []}
              backMatter={thesis?.backMatter || []}
              activeSection={activeSection}
              onContentChange={onContentChange}
              onTitleChange={onTitleChange}
              onUpdateChapter={async (chapter) => {
                await onUpdateChapter(chapter);
              }}
              onAddChapter={async (chapter) => {
                await onAddChapter(chapter);
              }}
              hasGeneralIntroduction={true}
              onAddGeneralIntroduction={async () => {}}
              onRemoveChapter={async () => {}}
            />
          )}
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