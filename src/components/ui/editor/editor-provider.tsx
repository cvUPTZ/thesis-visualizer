import React from 'react';
import { Editor } from '@tiptap/react';
import { EditorContent } from '@tiptap/react';

interface EditorProviderProps {
  children: React.ReactNode;
  content: string;
  onUpdate?: (content: string) => void;
  editorRef?: React.MutableRefObject<Editor | null>;
}

export function EditorProvider({ children, content, onUpdate, editorRef }: EditorProviderProps) {
  const editor = editorRef?.current;

  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="editor-provider">
      {children}
      <EditorContent editor={editor} />
    </div>
  );
}