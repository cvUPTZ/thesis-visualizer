import React from 'react';
import MDEditor from '@uiw/react-md-editor';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const MarkdownEditor = ({ value, onChange, placeholder }: MarkdownEditorProps) => {
  return (
    <div 
      className="w-full rounded-lg overflow-hidden transition-all duration-200 hover:shadow-editor" 
      data-color-mode="light"
    >
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || '')}
        preview="edit"
        height={400}
        className="border-none"
        hideToolbar={false}
        textareaProps={{
          placeholder,
          style: {
            backgroundColor: 'var(--editor-bg)',
            fontSize: '16px',
            lineHeight: '1.6',
            padding: '16px',
          }
        }}
        previewOptions={{
          className: "prose prose-lg max-w-none",
          skipHtml: false,
          rehypeRewrite: (node: any) => {
            if (node.type === 'element' && node.tagName === 'a') {
              node.properties = {
                ...node.properties,
                target: '_blank',
                rel: 'noopener noreferrer',
                className: 'text-editor-accent hover:text-editor-accent/90 transition-colors duration-200'
              };
            }
          }
        }}
      />
    </div>
  );
};