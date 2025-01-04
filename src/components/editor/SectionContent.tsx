import React, { useCallback } from 'react';
import { MarkdownEditor } from '../MarkdownEditor';

interface SectionContentProps {
  content: string;
  onContentChange: (content: string) => void;
}

export const SectionContent = ({ content, onContentChange }: SectionContentProps) => {
  console.log('Rendering SectionContent:', { contentLength: content?.length });
  
  const handleChange = useCallback((value: string | undefined) => {
    console.log('Content change detected:', { 
      newContentLength: value?.length 
    });
    onContentChange(value || '');
  }, [onContentChange]);
  
  return (
    <div className="relative">
      <MarkdownEditor
        value={content}
        onChange={handleChange}
        placeholder="Start writing..."
      />
    </div>
  );
};