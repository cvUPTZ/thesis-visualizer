// components/MarkdownEditor.tsx
import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import MDEditor, { commands, type ICommand } from '@uiw/react-md-editor';
import { debounce } from 'lodash';
import { Card } from './ui/card';
import { Figure, Table, Citation, Reference } from '@/types/thesis';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onInsertFigure?: (figure: Omit<Figure, 'id' | 'number'>) => void;
  onInsertTable?: (table: Omit<Table, 'id' | 'number'>) => void;
  onInsertCitation?: (citation: Omit<Citation, 'id' | 'thesis_id' | 'created_at' | 'updated_at'>) => void;
  figures?: Figure[];
  tables?: Table[];
  citations?: Citation[];
}

// Custom commands for thesis-specific features
const createThesisCommands = (props: EditorProps): ICommand[] => ([
  {
    name: 'insertFigure',
    keyCommand: 'insertFigure',
    buttonProps: { 'aria-label': 'Insert Figure' },
    icon: <span>📷</span>,
    execute: () => {
      props.onInsertFigure?.({
        imageUrl: '',
        title: '',
        caption: '',
        altText: '',
        dimensions: { width: 0, height: 0 },
        position: 'center'
      });
    },
  },
  {
    name: 'insertTable',
    keyCommand: 'insertTable',
    buttonProps: { 'aria-label': 'Insert Table' },
    icon: <span>📊</span>,
    execute: () => {
      props.onInsertTable?.({
        title: '',
        caption: '',
        content: [['']],
      });
    },
  },
  {
    name: 'insertCitation',
    keyCommand: 'insertCitation',
    buttonProps: { 'aria-label': 'Insert Citation' },
    icon: <span>📚</span>,
    execute: () => {
      props.onInsertCitation?.({
        text: '',
        source: '',
        authors: [],
        year: '',
        type: 'article'
      });
    },
  }
]);

export const MarkdownEditor = React.memo(({ 
  value, 
  onChange,
  placeholder,
  onInsertFigure,
  onInsertTable,
  onInsertCitation,
  figures,
  tables,
  citations
}: EditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  
  const debouncedOnChange = useMemo(
    () => debounce((val: string) => {
      onChange(val || '');
    }, 150),
    [onChange]
  );

  useEffect(() => {
    return () => {
      debouncedOnChange.cancel();
    };
  }, [debouncedOnChange]);

  const customCommands = useMemo(() => {
    const baseCommands = [
      commands.bold,
      commands.italic,
      commands.strikethrough,
      commands.link,
      commands.quote,
      commands.code,
      commands.unorderedListCommand,
      commands.orderedListCommand
    ] as ICommand[];

    const thesisCommands = createThesisCommands({
      value,
      onChange,
      onInsertFigure,
      onInsertTable,
      onInsertCitation
    });

    return [...baseCommands, commands.divider, ...thesisCommands];
  }, [value, onChange, onInsertFigure, onInsertTable, onInsertCitation]);

  const editorProps = useMemo(() => ({
    value,
    onChange: debouncedOnChange,
    preview: "edit" as const,
    height: 400,
    className: "border-none bg-transparent",
    hideToolbar: false,
    commands: customCommands,
    visibleDragbar: false,
    renderTextarea: true,
    textareaProps: {
      placeholder,
      className: "focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-md p-4 bg-editor-bg/50",
    },
    previewOptions: {
      className: "prose prose-sm max-w-none prose-headings:font-serif prose-headings:text-editor-text prose-p:text-editor-text p-4",
      skipHtml: true,
      rehypeRewrite: undefined
    }
  }), [value, debouncedOnChange, customCommands, placeholder]);

  return (
    <div ref={editorRef} className="transform translate-y-0 opacity-100 transition-transform duration-300">
      <Card className="overflow-hidden bg-white/50 backdrop-blur-sm border-2 border-primary/10 shadow-xl rounded-xl" data-color-mode="light">
        <MDEditor {...editorProps} />
        {figures && figures.length > 0 && (
          <div className="p-4 border-t">
            <h4 className="text-sm font-medium mb-2">Figures</h4>
            <div className="flex flex-wrap gap-2">
              {figures.map(figure => (
                <div key={figure.id} className="text-xs bg-gray-100 p-1 rounded">
                  Figure {figure.number}: {figure.title}
                </div>
              ))}
            </div>
          </div>
        )}
        {citations && citations.length > 0 && (
          <div className="p-4 border-t">
            <h4 className="text-sm font-medium mb-2">Citations</h4>
            <div className="flex flex-wrap gap-2">
              {citations.map(citation => (
                <div key={citation.id} className="text-xs bg-gray-100 p-1 rounded">
                  {citation.authors.join(', ')} ({citation.year})
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
});

MarkdownEditor.displayName = 'MarkdownEditor';