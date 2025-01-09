import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '../button';

interface ToolbarProps {
  editor: Editor | null;
  children: React.ReactNode;
}

export const Toolbar = ({ editor, children }: ToolbarProps) => {
  if (!editor) return null;

  return (
    <div className="border-b p-2 flex gap-2 flex-wrap">
      {children}
    </div>
  );
};