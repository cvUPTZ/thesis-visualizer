// components/MarkdownEditor.tsx
import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import MDEditor, { commands, type ICommand } from '@uiw/react-md-editor';
import { debounce } from 'lodash';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Image, Link, Table as TableIcon, Quote, FileText } from 'lucide-react';

interface Figure {
  id?: string;
  number?: number;
  imageUrl: string;
  title: string;
  caption: string;
  altText: string;
  dimensions: {
    width: number;
    height: number;
  };
  position: 'left' | 'center' | 'right';
}

interface Table {
  id?: string;
  number?: number;
  title: string;
  caption: string;
  content: string[][];
}

interface Citation {
  id?: string;
  thesis_id?: string;
  text: string;
  source: string;
  authors: string[];
  year: string;
  type: 'article' | 'book' | 'conference' | 'website' | 'other';
  created_at?: Date;
  updated_at?: Date;
}

interface Reference {
  id: string;
  citation_id: string;
  page_number?: string;
  section?: string;
}

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
  readOnly?: boolean;
  minHeight?: number;
  maxHeight?: number;
  className?: string;
}

const DEFAULT_FIGURE: Omit<Figure, 'id' | 'number'> = {
  imageUrl: '',
  title: '',
  caption: '',
  altText: '',
  dimensions: { width: 800, height: 600 },
  position: 'center'
};

const DEFAULT_TABLE: Omit<Table, 'id' | 'number'> = {
  title: '',
  caption: '',
  content: [['', ''], ['', '']]
};

const DEFAULT_CITATION: Omit<Citation, 'id' | 'thesis_id' | 'created_at' | 'updated_at'> = {
  text: '',
  source: '',
  authors: [],
  year: new Date().getFullYear().toString(),
  type: 'article'
};

const createThesisCommands = (props: EditorProps): ICommand[] => ([
  {
    name: 'insertFigure',
    keyCommand: 'insertFigure',
    buttonProps: { 'aria-label': 'Insert Figure' },
    icon: <Image className="w-4 h-4" />,
    execute: () => {
      props.onInsertFigure?.(DEFAULT_FIGURE);
    },
  },
  {
    name: 'insertTable',
    keyCommand: 'insertTable',
    buttonProps: { 'aria-label': 'Insert Table' },
    icon: <TableIcon className="w-4 h-4" />,
    execute: () => {
      props.onInsertTable?.(DEFAULT_TABLE);
    },
  },
  {
    name: 'insertCitation',
    keyCommand: 'insertCitation',
    buttonProps: { 'aria-label': 'Insert Citation' },
    icon: <FileText className="w-4 h-4" />,
    execute: () => {
      props.onInsertCitation?.(DEFAULT_CITATION);
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
  figures = [],
  tables = [],
  citations = [],
  readOnly = false,
  minHeight = 400,
  maxHeight = 800,
  className = ''
}: EditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [hasRenderError, setHasRenderError] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  
  const handleCharacterRendering = useCallback((val: string) => {
    if (!val) return '';
    
    try {
      // Handle UTF-8 encoding and potential surrogate pairs
      const encoded = new TextEncoder().encode(val);
      const decoded = new TextDecoder('utf-8', { fatal: true }).decode(encoded);
      setHasRenderError(false);
      return decoded;
    } catch (error) {
      console.error('Character rendering error:', error);
      setHasRenderError(true);
      // Return sanitized version of the string
      return val.replace(/[\uD800-\uDFFF]/g, '');
    }
  }, []);

  const debouncedOnChange = useMemo(
    () => debounce((val: string) => {
      const processedValue = handleCharacterRendering(val);
      onChange(processedValue);
    }, 150),
    [onChange, handleCharacterRendering]
  );

  useEffect(() => {
    return () => {
      debouncedOnChange.cancel();
    };
  }, [debouncedOnChange]);

  const customCommands = useMemo(() => {
    if (readOnly) return [];

    const baseCommands = [
      commands.bold,
      commands.italic,
      commands.strikethrough,
      commands.hr,
      commands.title,
      commands.divider,
      commands.link,
      commands.quote,
      commands.code,
      commands.image,
      commands.unorderedListCommand,
      commands.orderedListCommand,
      commands.checkedListCommand
    ] as ICommand[];

    const thesisCommands = createThesisCommands({
      value,
      onChange,
      onInsertFigure,
      onInsertTable,
      onInsertCitation
    });

    return [...baseCommands, commands.divider, ...thesisCommands];
  }, [value, onChange, onInsertFigure, onInsertTable, onInsertCitation, readOnly]);

  const handleCompositionStart = useCallback(() => {
    setIsComposing(true);
  }, []);

  const handleCompositionEnd = useCallback(() => {
    setIsComposing(false);
  }, []);

  const editorProps = useMemo(() => ({
    value,
    onChange: debouncedOnChange,
    preview: readOnly ? "preview" as const : "edit" as const,
    height: minHeight,
    className: `border-none bg-transparent ${className}`,
    hideToolbar: readOnly,
    commands: customCommands,
    visibleDragbar: false,
    renderTextarea: true,
    textareaProps: {
      placeholder,
      className: "focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-md p-4 bg-editor-bg/50",
      onCompositionStart: handleCompositionStart,
      onCompositionEnd: handleCompositionEnd,
      onBeforeInput: (e: InputEvent) => {
        if (isComposing) return;
        
        const input = e.data;
        if (input) {
          try {
            new TextEncoder().encode(input);
          } catch (error) {
            e.preventDefault();
            setHasRenderError(true);
          }
        }
      },
      style: {
        minHeight: `${minHeight}px`,
        maxHeight: `${maxHeight}px`,
      }
    },
    previewOptions: {
      className: "prose prose-sm max-w-none prose-headings:font-serif prose-headings:text-editor-text prose-p:text-editor-text p-4",
      skipHtml: true,
      rehypeRewrite: undefined,
      transformLinkUri: null
    }
  }), [
    value,
    debouncedOnChange,
    customCommands,
    placeholder,
    readOnly,
    minHeight,
    maxHeight,
    className,
    isComposing
  ]);

  return (
    <div 
      ref={editorRef} 
      className="transform translate-y-0 opacity-100 transition-transform duration-300"
      data-color-mode="light"
    >
      <Card 
        className="overflow-hidden bg-white/50 backdrop-blur-sm border-2 border-primary/10 shadow-xl rounded-xl"
      >
        {hasRenderError && (
          <Alert variant="destructive" className="mb-2">
            <AlertDescription>
              There was an issue rendering some characters. Please check your input.
            </AlertDescription>
          </Alert>
        )}
        
        <MDEditor {...editorProps} />

        {!readOnly && (
          <>
            {figures.length > 0 && (
              <div className="p-4 border-t">
                <h4 className="text-sm font-medium mb-2">Figures</h4>
                <div className="flex flex-wrap gap-2">
                  {figures.map(figure => (
                    <div key={figure.id} className="text-xs bg-gray-100 p-2 rounded">
                      Figure {figure.number}: {figure.title}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tables.length > 0 && (
              <div className="p-4 border-t">
                <h4 className="text-sm font-medium mb-2">Tables</h4>
                <div className="flex flex-wrap gap-2">
                  {tables.map(table => (
                    <div key={table.id} className="text-xs bg-gray-100 p-2 rounded">
                      Table {table.number}: {table.title}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {citations.length > 0 && (
              <div className="p-4 border-t">
                <h4 className="text-sm font-medium mb-2">Citations</h4>
                <div className="flex flex-wrap gap-2">
                  {citations.map(citation => (
                    <div key={citation.id} className="text-xs bg-gray-100 p-2 rounded">
                      {citation.authors.join(', ')} ({citation.year})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
});

MarkdownEditor.displayName = 'MarkdownEditor';