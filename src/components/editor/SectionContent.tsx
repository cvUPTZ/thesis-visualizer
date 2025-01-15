import React from 'react';
import { MarkdownEditor } from '../MarkdownEditor';

interface SectionContentProps {
  content: string;
  onContentChange: (content: string) => void;
}

export const SectionContent = ({ content, onContentChange }: SectionContentProps) => {
  console.log('Rendering SectionContent:', { contentLength: content?.length });
  
  return (
    <div className="editor-content">
      <MarkdownEditor
        value={content}
        onChange={onContentChange}
        placeholder="Start writing..."
      />
    </div>
  );
};