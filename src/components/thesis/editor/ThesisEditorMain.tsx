import React, { useCallback, useMemo } from 'react';
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
  console.log('ThesisEditorMain rendering:', { activeSection });

  const { generalIntroduction, generalConclusion } = useMemo(() => ({
    generalIntroduction: thesis?.content?.generalIntroduction,
    generalConclusion: thesis?.content?.generalConclusion
  }), [thesis?.content]);

  const handleSectionUpdate = useCallback((section: Section) => {
    if (!thesis) return;
    
    const content = Array.isArray(section.content) 
      ? section.content.map(item => item.content).join('\n\n')
      : section.content;
      
    onContentChange(section.id, content);
    onTitleChange(section.id, section.title);
  }, [thesis, onContentChange, onTitleChange]);

  return (
    <main className="flex-1 p-8 flex">
      <div className={`transition-all duration-300 ${showPreview ? 'w-1/2' : 'w-full'}`}>
        <div className="max-w-4xl mx-auto space-y-8">
          {generalIntroduction && (
            <Card className="p-6">
              <GeneralSectionEditor
                section={generalIntroduction}
                title="General Introduction"
                onUpdate={handleSectionUpdate}
              />
            </Card>
          )}

          <ThesisEditorContent
            frontMatter={thesis?.content?.frontMatter || []}
            chapters={thesis?.content?.chapters || []}
            backMatter={thesis?.content?.backMatter || []}
            generalIntroduction={generalIntroduction}
            generalConclusion={generalConclusion}
            activeSection={activeSection}
            onContentChange={onContentChange}
            onTitleChange={onTitleChange}
            onUpdateChapter={onUpdateChapter}
            onAddChapter={onAddChapter}
            thesis={thesis}
            thesisId={thesis?.id || ''}
            onUpdateThesis={() => {}}
          />

          {generalConclusion && (
            <Card className="p-6">
              <GeneralSectionEditor
                section={generalConclusion}
                title="General Conclusion"
                onUpdate={handleSectionUpdate}
              />
            </Card>
          )}
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