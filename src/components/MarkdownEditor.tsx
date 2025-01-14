import React from 'react';
import { motion } from 'framer-motion';
import MDEditor from '@uiw/react-md-editor';
import { Card } from '@/components/ui/card';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onInsertFigure?: (figure: any) => void;
  onInsertTable?: (table: any) => void;
  onInsertCitation?: (citation: any) => void;
  figures?: any[];
  tables?: any[];
  citations?: any[];
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder,
  onInsertFigure,
  onInsertTable,
  onInsertCitation,
  figures,
  tables,
  citations,
}) => {
  console.log('MarkdownEditor rendering with value length:', value?.length);

  const handleChange = (val: string | undefined) => {
    console.log('Editor value changed:', val);
    onChange(val || '');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden bg-white/50 backdrop-blur-sm border-2 border-primary/10 shadow-xl rounded-xl" data-color-mode="light">
        <MDEditor
          value={value}
          onChange={handleChange}
          preview="edit"
          height={400}
          className="border-none bg-transparent"
          textareaProps={{
            placeholder,
            className: "focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-md p-4 bg-editor-bg/50",
            id: "markdown-editor-textarea"
          }}
          previewOptions={{
            className: "prose prose-sm max-w-none prose-headings:font-serif prose-headings:text-editor-text prose-p:text-editor-text p-4",
          }}
        />
      </Card>
    </motion.div>
  );
};