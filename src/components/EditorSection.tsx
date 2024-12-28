import React from 'react';
import { Section } from './ThesisEditor';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface EditorSectionProps {
  section: Section;
  isActive: boolean;
  onContentChange: (id: string, content: string) => void;
  onTitleChange: (id: string, title: string) => void;
}

export const EditorSection = ({
  section,
  isActive,
  onContentChange,
  onTitleChange
}: EditorSectionProps) => {
  if (!isActive) return null;

  return (
    <div className="editor-section">
      <div className="flex items-center gap-3 mb-4">
        <Input
          value={section.title}
          onChange={(e) => onTitleChange(section.id, e.target.value)}
          className="text-xl font-serif border-none bg-transparent px-0 focus-visible:ring-0"
        />
        {section.required && (
          <Badge variant="secondary">Required</Badge>
        )}
      </div>
      <Textarea
        value={section.content}
        onChange={(e) => onContentChange(section.id, e.target.value)}
        className="min-h-[200px] border-none bg-transparent resize-none focus-visible:ring-0"
        placeholder="Start writing..."
      />
    </div>
  );
};