import React from 'react';
import EditorSection from '@/components/thesis/section/EditorSection';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface EditorContentProps {
  title: string;
  content: string;
  required?: boolean;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
}

export const EditorContent: React.FC<EditorContentProps> = ({
  title,
  content,
  required,
  onTitleChange,
  onContentChange
}) => {
  const handleTitleChange = (newTitle: string) => {
    if (newTitle.trim() === '') {
      console.error('Title cannot be empty');
      return;
    }
    onTitleChange(newTitle);
  };

  const handleContentChange = (newContent: string) => {
    if (newContent.trim() === '') {
      console.error('Content cannot be empty');
      return;
    }
    onContentChange(newContent);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="text-xl font-serif border-none bg-transparent px-0 focus-visible:ring-0 text-editor-text"
          placeholder="Section Title"
        />
        {required && (
          <Badge variant="secondary" className="bg-editor-accent/10 text-editor-accent">
            Required
          </Badge>
        )}
      </div>
      
      <MarkdownEditor
        value={content}
        onChange={handleContentChange}
        placeholder="Start writing..."
      />
    </div>
  );
};