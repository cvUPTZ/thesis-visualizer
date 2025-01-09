import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '../button';

interface ToolbarProps {
  editor: Editor | null;
  children: React.ReactNode;
}

export const Toolbar: React.FC<ToolbarProps> = ({ editor, children }) => {
  if (!editor) return null;

  return (
    <div className="border-b p-2 flex gap-2 flex-wrap">
      {children}
    </div>
  );
};