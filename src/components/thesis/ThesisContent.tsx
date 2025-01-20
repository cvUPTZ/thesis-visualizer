import React from 'react';
import { Chapter, Section, Thesis } from '@/types/thesis';
import { ChapterManager } from '../ChapterManager';
import { Input } from '@/components/ui/input';
import { MarkdownEditor } from '../MarkdownEditor';
import { ChatMessages } from '../collaboration/ChatMessages';
import { GeneralSectionEditor } from '../editor/sections/GeneralSectionEditor';

interface ThesisContentProps {
  frontMatter: Section[];
  chapters: Chapter[];
  backMatter: Section[];
  activeSection: string;
  onContentChange: (id: string, content: string) => void;
  onTitleChange: (id: string, title: string) => void;
  onUpdateChapter: (chapter: Chapter) => void;
  onAddChapter: (chapter: Chapter) => void;
  thesisId: string;
  thesis: Thesis;
  onUpdateThesis: (thesis: Thesis) => void;
}

export const ThesisContent: React.FC<ThesisContentProps> = ({
  frontMatter,
  chapters,
  backMatter,
  activeSection,
  onContentChange,
  onTitleChange,
  onUpdateChapter,
  onAddChapter,
  thesisId,
  thesis,
  onUpdateThesis
}) => {
  const handleGeneralSectionUpdate = (type: 'introduction' | 'conclusion') => (section: Section) => {
    if (!thesis) return;
    
    const updatedThesis = {
      ...thesis,
      [type === 'introduction' ? 'generalIntroduction' : 'generalConclusion']: section
    };
    onUpdateThesis(updatedThesis);
  };

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
          
          <div className="space-y-8">
            <GeneralSectionEditor
              section={thesis?.generalIntroduction}
              title="General Introduction"
              onUpdate={handleGeneralSectionUpdate('introduction')}
            />
            
            <ChapterManager
              chapters={chapters}
              onUpdateChapter={onUpdateChapter}
              onAddChapter={onAddChapter}
            />
            
            <GeneralSectionEditor
              section={thesis?.generalConclusion}
              title="General Conclusion"
              onUpdate={handleGeneralSectionUpdate('conclusion')}
            />
          </div>
          
          {backMatter.map(section => renderSectionContent(section))}
        </div>
        
        <div className="lg:col-span-1">
          <ChatMessages thesisId={thesisId} />
        </div>
      </div>
    </div>
  );
};