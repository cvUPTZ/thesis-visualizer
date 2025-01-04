import React from 'react';
import MDEditor from '@uiw/react-md-editor';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
}

export const MarkdownEditor = ({ value, onChange, placeholder }: MarkdownEditorProps) => {
  return (
    <div className="w-full rounded-lg overflow-hidden" data-color-mode="light">
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || '')}
        preview="edit"
        height={400}
        className="border-none bg-transparent shadow-none hover:shadow-sm transition-shadow duration-200"
        hideToolbar={false}
        textareaProps={{
          placeholder,
          className: "focus:outline-none focus:ring-2 focus:ring-editor-accent/20 rounded-md",
        }}
        previewOptions={{
          className: "prose prose-sm max-w-none prose-headings:font-serif prose-headings:text-editor-text prose-p:text-editor-text",
          skipHtml: false,
          rehypeRewrite: (node: any) => {
            if (node.type === 'element' && node.tagName === 'a') {
              node.properties = {
                ...node.properties,
                target: '_blank',
                rel: 'noopener noreferrer',
                className: 'text-editor-accent hover:text-editor-accent/80 transition-colors duration-200'
              };
            }
          }
        }}
      />
    </div>
  );
};