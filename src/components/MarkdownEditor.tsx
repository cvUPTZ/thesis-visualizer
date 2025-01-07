import React from 'react';
import MDEditor, { commands } from '@uiw/react-md-editor';
import { EditorProps } from '@/types/components';
import { Card } from './ui/card';
import { motion } from 'framer-motion';

export const MarkdownEditor: React.FC<EditorProps> = ({ 
  value, 
  onChange, 
  placeholder 
}) => {
  const headingCommands = [
    commands.title1,
    commands.title2,
    commands.title3,
    commands.title4,
    commands.title5,
    commands.title6,
  ];

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden bg-white/50 backdrop-blur-sm border-2 border-primary/10 shadow-xl rounded-xl" data-color-mode="light">
        <MDEditor
          value={value}
          onChange={(val) => onChange(val || '')}
          preview="edit"
          height={400}
          className="border-none bg-transparent"
          hideToolbar={false}
          commands={customCommands}
          textareaProps={{
            placeholder,
            className: "focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-md p-4 bg-editor-bg/50",
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
                  className: 'text-primary hover:text-primary/80 transition-colors duration-200'
                };
              }
            }
          }}
        />
      </Card>
    </motion.div>
  );
};