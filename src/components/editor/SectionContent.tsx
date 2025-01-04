import React from 'react';
import { MarkdownEditor } from '../MarkdownEditor';

interface SectionContentProps {
  content: string;
  onContentChange: (content: string) => void;
}

export const SectionContent = ({ content, onContentChange }: SectionContentProps) => {
  console.log('Rendering SectionContent with:', { content });
  
  return (
    <div className="relative">
      <MarkdownEditor
        value={content}
        onChange={onContentChange}
        placeholder="Start writing..."
      />
    </div>
  );
};