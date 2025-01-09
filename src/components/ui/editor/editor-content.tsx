import React from 'react';
import { Editor, EditorContent as TipTapEditorContent } from '@tiptap/react';

interface EditorContentProps {
  editor: Editor | null;
}

export function EditorContent({ editor }: EditorContentProps) {
  if (!editor) {
    return null;
  }

  return (
    <div className="editor-content p-4">
      <TipTapEditorContent editor={editor} />
    </div>
  );
}