import React from 'react';
import MDEditor, { commands } from '@uiw/react-md-editor';
import { EditorProps } from '@/types/components';

export const MarkdownEditor: React.FC<EditorProps> = ({ 
  value, 
  onChange, 
  placeholder 
}) => {
  // Custom heading commands for H1-H6
  const headingCommands = [
    commands.title1,
    commands.title2,
    commands.title3,
    commands.title4,
    commands.title5,
    commands.title6,
  ];

  // Combine with other default commands
  const customCommands = [
    ...headingCommands,
    commands.divider,
    commands.bold,
    commands.italic,
    commands.strikethrough,
    commands.hr,
    commands.divider,
    commands.link,
    commands.quote,
    commands.code,
    commands.divider,
    commands.unorderedListCommand,
    commands.orderedListCommand,
    commands.checkedListCommand,
  ];

  console.log('MarkdownEditor rendering with value length:', value?.length);

  return (
    <div className="w-full rounded-lg overflow-hidden bg-white shadow-lg" data-color-mode="light">
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || '')}
        preview="edit"
        height={400}
        className="border-none bg-transparent shadow-none hover:shadow-sm transition-shadow duration-200"
        hideToolbar={false}
        commands={customCommands}
        textareaProps={{
          placeholder,
          className: "focus:outline-none focus:ring-2 focus:ring-editor-accent/20 rounded-md p-4 bg-editor-bg",
        }}
        previewOptions={{
          className: "prose prose-sm max-w-none prose-headings:font-serif prose-headings:text-editor-text prose-p:text-editor-text p-4",
          skipHtml: false,
          rehypeRewrite: (node: any) => {
            if (node.type === 'element' && node.tagName === 'a') {
              node.properties = {
                ...node.properties,
                target: '_blank',
                rel: 'noopener noreferrer',
                className: 'text-editor-accent hover:text-editor-accent-hover transition-colors duration-200'
              };
            }
          }
        }}
      />
    </div>
  );
};