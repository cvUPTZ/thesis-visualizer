import React, { useCallback, useMemo } from 'react';
import { Chapter, Section } from '@/types/thesis';
import { Input } from '@/components/ui/input';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { ChapterManager } from '@/components/ChapterManager';
import { ChatMessages } from '@/components/collaboration/ChatMessages';

// Separate Section Editor Component
const SectionEditor = React.memo(({ 
  section, 
  onTitleChange, 
  onContentChange 
}: { 
  section: Section;
  onTitleChange: (id: string, title: string) => void;
  onContentChange: (id: string, content: string) => void;
}) => {
  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onTitleChange(section.id, e.target.value);
  }, [section.id, onTitleChange]);

  const handleContentChange = useCallback((value: string) => {
    onContentChange(section.id, value);
  }, [section.id, onContentChange]);

  return (
    <div className="editor-section space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <Input
          value={section.title}
          onChange={handleTitleChange}
          className="text-xl font-serif border-none bg-transparent px-0 focus-visible:ring-0"
          placeholder="Section Title"
        />
      </div>
      <div className="mb-6">
        <MarkdownEditor
          value={section.content}
          onChange={handleContentChange}
          placeholder="Start writing..."
        />
      </div>
    </div>
  );
});

export const ThesisEditorContent: React.FC<ThesisEditorContentProps> = React.memo(({
  frontMatter,
  chapters,
  backMatter,
  activeSection,
  onContentChange,
  onTitleChange,
  onUpdateChapter,
  onAddChapter,
  onUpdateSectionData,
  onAddSectionTask,
  onUpdateSectionTask,
  onChangeSectionTaskDescription
}) => {
  const renderSectionContent = useCallback((section: Section) => {
    const isActive = activeSection === section.id;
    if (!isActive) return null;

    return (
      <SectionEditor
        key={section.id}
        section={section}
        onTitleChange={onTitleChange}
        onContentChange={onContentChange}
      />
    );
  }, [activeSection, onTitleChange, onContentChange]);

  // Memoize sections that need rendering
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
          {activeSection && (
            <ChatMessages 
              key={activeSection} 
              thesisId={activeSection} 
            />
          )}
        </div>
      </div>
    </div>
  );
});

// Type declarations remain the same
export type ThesisEditorContentProps = {
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
};