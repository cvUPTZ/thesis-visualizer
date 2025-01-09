import React from 'react';
import { Editor } from '@tiptap/react';

interface ToolbarProps {
  editor: Editor | null;
  children: React.ReactNode;
}

export function Toolbar({ editor, children }: ToolbarProps) {
  if (!editor) {
    return null;
  }

  return (
    <div className="editor-toolbar flex flex-wrap gap-1 p-2 border-b">
      {children}
    </div>
  );
}