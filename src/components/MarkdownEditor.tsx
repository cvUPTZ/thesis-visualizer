// MarkdownEditor.tsx
import React, { useCallback, useMemo } from 'react';
import MDEditor, { commands } from '@uiw/react-md-editor';
import { EditorProps, Section } from '@/types/components';
import { Card } from './ui/card';
import { motion } from 'framer-motion';
import debounce from 'lodash/debounce';

export const MarkdownEditor: React.FC<EditorProps> = React.memo(({ 
  value, 
  onChange, 
  placeholder 
}) => {
  const customCommands = useMemo(() => [
    commands.title1,
    commands.title2,
    commands.title3,
    commands.title4,
    commands.title5,
    commands.title6,
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
  ], []);

  const handleChange = useCallback(
    debounce((val: string | undefined) => {
      onChange(val || '');
    }, 100),
    [onChange]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      layout="position"
    >
      <Card 
        className="overflow-hidden bg-white/50 backdrop-blur-sm border-2 border-primary/10 shadow-xl rounded-xl" 
        data-color-mode="light"
      >
        <MDEditor
          value={value}
          onChange={handleChange}
          preview="edit"
          height={400}
          className="border-none bg-transparent"
          hideToolbar={false}
          commands={customCommands}
          textareaProps={{
            placeholder,
            className: "focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-md p-4 bg-editor-bg/50",
            "data-testid": "markdown-editor-textarea"
          }}
          previewOptions={{
            className: "prose prose-sm max-w-none prose-headings:font-serif prose-headings:text-editor-text prose-p:text-editor-text p-4",
            skipHtml: true,
            lazy: true
          }}
        />
      </Card>
    </motion.div>
  );
});

// Example usage in SectionContent component
export const SectionContent: React.FC<SectionContentProps> = ({
  section,
  isActive,
  onContentChange,
  onUpdateSectionData
}) => {
  const handleEditorChange = useCallback((content: string) => {
    onContentChange(content);
    onUpdateSectionData({
      ...section,
      content
    });
  }, [section, onContentChange, onUpdateSectionData]);

  if (!isActive) return null;

  return (
    <div className="w-full">
      <MarkdownEditor
        value={section.content}
        onChange={handleEditorChange}
        placeholder="Start writing your section content..."
      />
    </div>
  );
};