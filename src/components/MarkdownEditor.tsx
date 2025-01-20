import React from 'react';
import MDEditor, { commands, ICommand, PreviewType } from '@uiw/react-md-editor';
import { motion } from 'framer-motion';
import { Card } from './ui/card';
import rehypeSanitize from 'rehype-sanitize';

interface EditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  placeholder?: string;
  readOnly?: boolean;
  preview?: PreviewType;
}

export const MarkdownEditor: React.FC<EditorProps> = ({
  value,
  onChange,
  placeholder,
  readOnly = false,
  preview = "live"
}) => {
  console.log('MarkdownEditor rendering with:', { valueLength: value?.length, readOnly });

  // Define common editor commands
  const extraCommands: ICommand[] = [
    commands.title1,
    commands.title2,
    commands.title3,
    commands.title4,
    commands.title5,
    commands.title6,
    commands.divider,
    commands.group([
      commands.title1,
      commands.title2,
      commands.title3,
      commands.title4,
      commands.title5,
      commands.title6,
    ], {
      name: 'title',
      groupName: 'title',
      buttonProps: { 'aria-label': 'Insert title' },
    }),
    commands.group([
      commands.orderedListCommand,
      commands.unorderedListCommand,
      commands.checkedListCommand,
    ], {
      name: 'list',
      groupName: 'list',
      buttonProps: { 'aria-label': 'Insert list' },
    }),
  ];

  return (
    <Card className="w-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <MDEditor
          value={value}
          onChange={onChange}
          commands={extraCommands}
          preview={preview}
          hideToolbar={readOnly}
          readOnly={readOnly}
          textareaProps={{
            placeholder: placeholder || 'Start writing...',
            'aria-label': 'Markdown editor'
          }}
          previewOptions={{
            rehypePlugins: [[rehypeSanitize]]
          }}
          className="w-full min-h-[200px]"
        />
      </motion.div>
    </Card>
  );
};