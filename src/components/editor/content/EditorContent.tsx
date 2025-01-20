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
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
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
        onChange={(value) => onContentChange(value || '')}
        placeholder="Start writing..."
      />
    </div>
  );
};