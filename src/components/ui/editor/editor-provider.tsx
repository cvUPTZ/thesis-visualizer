import React from 'react';
import { useEditor, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';

interface EditorProviderProps {
  children: React.ReactNode;
  content: string;
  onUpdate: (content: string) => void;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({ children, content, onUpdate }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Image,
      Table
    ],
    content,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
  });

  return (
    <div className="border rounded-md">
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { editor });
        }
        return child;
      })}
    </div>
  );
};