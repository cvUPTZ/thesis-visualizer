import React from 'react';
import MDEditor, { commands, ICommand } from '@uiw/react-md-editor';
import { motion } from 'framer-motion';
import { Card } from './ui/card';
import rehypeSanitize from 'rehype-sanitize';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
}

export const MarkdownEditor: React.FC<EditorProps> = ({
  value,
  onChange,
  placeholder,
  readOnly = false
}) => {
  console.log('MarkdownEditor rendering with:', { valueLength: value?.length, readOnly });

  // Define common editor commands
  const extraCommands: ICommand[] = [
    commands.title1,
    commands.title2,
    commands.title3,
    commands.divider,
    commands.bold,
    commands.italic,
    commands.strikethrough,
    commands.hr,
    commands.divider,
    commands.link,
    commands.quote,
    commands.code,
    commands.image,
    commands.divider,
    commands.unorderedListCommand,
    commands.orderedListCommand,
    commands.checkedListCommand,
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Card className="w-full overflow-hidden border rounded-lg">
        <div data-color-mode="light">
          <MDEditor
            value={value}
            onChange={(val) => onChange(val || '')}
            height={400}
            preview="live"
            hideToolbar={readOnly}
            commands={extraCommands}
            readOnly={readOnly}
            visibleDragbar={false}
            textareaProps={{
              placeholder,
              "data-testid": "markdown-editor",
              style: {
                background: 'transparent',
                minHeight: '200px'
              }
            }}
            previewOptions={{
              className: "prose prose-sm max-w-none p-4",
              rehypePlugins: [[rehypeSanitize]],
            }}
          />
        </div>
      </Card>
    </motion.div>
  );
};