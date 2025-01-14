// components/ThesisEditorContent.tsx
import React, { useCallback, useMemo } from 'react';
import { Section, Chapter } from '@/types/thesis';
import { SectionEditor } from './SectionEditor';
import { ChapterManager } from './ChapterManager';
import { ChatMessages } from './collaboration/ChatMessages';
import { useThrottledState } from '@/hooks/useThrottledState';

interface ThesisEditorContentProps {
  frontMatter: Section[];
  chapters: Chapter[];
  backMatter: Section[];
  activeSection: string;
  onContentChange: (id: string, content: string) => void;
  onTitleChange: (id: string, title: string) => void;
  onUpdateChapter: (chapter: Chapter) => void;
  onAddChapter: (chapter: Chapter) => void;
  onUpdateSectionData: (section: Section) => void;
  onAddSectionTask: (sectionId: string) => void;
  onUpdateSectionTask: (sectionId: string, taskId: string, status: 'pending' | 'in progress' | 'completed' | 'on hold') => void;
  onChangeSectionTaskDescription: (sectionId: string, taskId: string, newDescription: string) => void;
}

export const ThesisEditorContent = React.memo(({
  frontMatter,
  chapters,
  backMatter,
  activeSection,
  onContentChange,
  onTitleChange,
  onUpdateChapter,
  onAddChapter,
  onUpdateSectionData,
  onAddSectionTask
}: ThesisEditorContentProps) => {
  const [localActiveSection, setLocalActiveSection] = useThrottledState<string>(activeSection);

  const renderSectionContent = useCallback((section: Section) => {
    const isActive = localActiveSection === section.id;
    if (!isActive) return null;

    return (
      <SectionEditor
        key={section.id}
        section={section}
        onTitleChange={onTitleChange}
        onContentChange={onContentChange}
      />
    );
  }, [localActiveSection, onTitleChange, onContentChange]);

  const activeContent = useMemo(() => {
    return [
      ...frontMatter.map(section => renderSectionContent(section)),
      ...backMatter.map(section => renderSectionContent(section))
    ].filter(Boolean);
  }, [frontMatter, backMatter, renderSectionContent]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {activeContent}
          
          <ChapterManager
            chapters={chapters}
            onUpdateChapter={onUpdateChapter}
            onAddChapter={onAddChapter}
          />
        </div>
        
        <div className="lg:col-span-1">
          {localActiveSection && (
            <ChatMessages 
              key={localActiveSection} 
              thesisId={localActiveSection} 
            />
          )}
        </div>
      </div>
    </div>
  );
});

ThesisEditorContent.displayName = 'ThesisEditorContent';