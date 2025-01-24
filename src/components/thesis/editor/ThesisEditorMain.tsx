import React, { useCallback } from 'react';
import { ThesisEditorContent } from './ThesisEditorContent';
import { Chapter, Section, Thesis } from '@/types/thesis';
import { GeneralSectionEditor } from '@/components/editor/sections/GeneralSectionEditor';
import { Card } from '@/components/ui/card';

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
  onAddChapter,
}) => {
  if (!thesis?.content) return null;

  const { generalIntroduction, generalConclusion } = thesis.content;

  console.log('ThesisEditorMain rendering with sections:', {
    generalIntroduction,
    generalConclusion,
    activeSection
  });

  const handleSectionUpdate = useCallback((section: Section) => {
    if (!thesis) return;
    onContentChange(section.id, section.content as string);
    onTitleChange(section.id, section.title);
  }, [thesis, onContentChange, onTitleChange]);

  return (
    <main className="flex-1 p-8 flex">
      <div className={`transition-all duration-300 ${showPreview ? 'w-1/2' : 'w-full'}`}>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* General Introduction Section */}
          <Card className="p-6">
            <GeneralSectionEditor
              section={generalIntroduction}
              title="General Introduction"
              onUpdate={handleSectionUpdate}
            />
          </Card>

          {/* Regular Sections */}
          <ThesisEditorContent
            frontMatter={thesis.content.frontMatter}
            chapters={thesis.content.chapters}
            backMatter={thesis.content.backMatter}
            generalIntroduction={thesis.content.generalIntroduction}
            generalConclusion={thesis.content.generalConclusion}
            activeSection={activeSection}
            onContentChange={onContentChange}
            onTitleChange={onTitleChange}
            onUpdateChapter={onUpdateChapter}
            onAddChapter={onAddChapter}
            thesis={thesis}
            onUpdateThesis={(updatedThesis) => {
              console.log('Updating thesis:', updatedThesis);
            }}
          />

          {/* General Conclusion Section */}
          <Card className="p-6">
            <GeneralSectionEditor
              section={generalConclusion}
              title="General Conclusion"
              onUpdate={handleSectionUpdate}
            />
          </Card>
        </div>
      </div>
      {showPreview && thesis && (
        <div className="w-1/2 pl-8 border-l">
          <div ref={previewRef}>
            {/* Preview content goes here */}
          </div>
        </div>
      )}
    </main>
  );
};