import React from 'react';
import { EditorContent as TiptapContent, Editor } from '@tiptap/react';

interface EditorContentProps {
  editor: Editor | null;
}

export const EditorContent = ({ editor }: EditorContentProps) => {
  return <TiptapContent editor={editor} className="p-4 prose prose-sm max-w-none" />;
};