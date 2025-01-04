import React from 'react';
import MDEditor from '@uiw/react-md-editor';

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string | undefined) => void;
    placeholder?: string;
    height?: number;
}

export const MarkdownEditor = ({
    value,
    onChange,
    placeholder,
    height = 400,
}: MarkdownEditorProps) => {
    return (
        <div className="w-full" data-color-mode="light">
            <MDEditor
                value={value}
                onChange={(val) => onChange(val || '')}
                preview="edit"
                height={height}
                className="border-none bg-transparent"
                hideToolbar={false}
                textareaProps={{
                    placeholder
                }}
                previewOptions={{
                  skipHtml: false,
                 rehypeRewrite: (node: any) => {
                    if (node.type === 'element' && node.tagName === 'a') {
                      node.properties = {
                        ...node.properties,
                         target: '_blank',
                        rel: 'noopener noreferrer'
                      };
                   }
                 }
               }}
          />
        </div>
   );
};