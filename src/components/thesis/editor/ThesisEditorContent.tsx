import React from 'react';
import { Chapter, Section } from '@/types/thesis';

export interface ThesisEditorContentProps {
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

const ThesisEditorContent: React.FC<ThesisEditorContentProps> = ({
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
  const renderSectionContent = (section: Section) => {
    const isActive = activeSection === section.id;
    if (!isActive) return null;

    return (
      <div key={section.id} className="editor-section space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Input
            value={section.title}
            onChange={(e) => onTitleChange(section.id, e.target.value)}
            className="text-xl font-serif border-none bg-transparent px-0 focus-visible:ring-0"
            placeholder="Section Title"
          />
        </div>
        <div className="mb-6">
          <MarkdownEditor
            value={section.content}
            onChange={(value) => onContentChange(section.id, value || '')}
            placeholder="Start writing..."
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {frontMatter.map(section => renderSectionContent(section))}
          
          <ChapterManager
            chapters={chapters}
            onUpdateChapter={onUpdateChapter}
            onAddChapter={onAddChapter}
          />
          
          {backMatter.map(section => renderSectionContent(section))}
        </div>
        
        <div className="lg:col-span-1">
          <ChatMessages thesisId={thesisId} />
        </div>
      </div>
    </div>
  );
};

export default ThesisEditorContent;
