import React from 'react';
import MDEditor from '@uiw/react-md-editor';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
}

export const MarkdownEditor = ({ value, onChange, placeholder }: MarkdownEditorProps) => {
  return (
    <div className="w-full" data-color-mode="light">
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || '')}
        preview="edit"
        height={400}
        className="border-none bg-transparent"
        hideToolbar={false}
        textareaProps={{
          placeholder: placeholder,
          "data-color-mode": "light"
        }}
        previewOptions={{
          skipHtml: false,
          linkTarget: "_blank"
        }}
      />
    </div>
  );
};