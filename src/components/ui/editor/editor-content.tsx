import React from 'react';
import { EditorContent as TiptapContent } from '@tiptap/react';

export const EditorContent = ({ editor }: { editor: any }) => {
  return <TiptapContent editor={editor} />;
};