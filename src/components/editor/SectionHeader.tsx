import React from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface SectionHeaderProps {
  title: string;
  required?: boolean;
  onTitleChange: (title: string) => void;
}

export const SectionHeader = ({ title, required, onTitleChange }: SectionHeaderProps) => {
  return (
    <div className="flex items-center gap-3">
      <Input
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="text-xl font-serif border-none bg-transparent px-0 focus-visible:ring-0 text-editor-text placeholder:text-editor-placeholder"
        placeholder="Section Title"
      />
      {required && (
        <Badge variant="secondary" className="bg-editor-accent/10 text-editor-accent">
          Required
        </Badge>
      )}
    </div>
  );
};