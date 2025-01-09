import React from 'react';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export const EditorProvider = ({ children, content, onUpdate }: {
  children: React.ReactNode;
  content: string;
  onUpdate: (content: string) => void;
}) => {
  const editor = useEditor({
    extensions: [StarterKit],
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