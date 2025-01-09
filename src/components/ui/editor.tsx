import React, { useState, useRef, useEffect } from 'react';
import { Editor as TipTapEditor } from '@tiptap/react';
import { EditorProps } from '@/types/components';
import { Citation } from '@/types/thesis';
import { CitationManager } from '@/components/CitationManager';
import { useThesis } from '@/hooks/useThesis';
import { Button } from './button';
import { Toolbar } from './toolbar';
import { EditorContent } from './editor-content';
import { EditorProvider } from './editor-provider';
import {
  Bold,
  Italic,
  Underline,
  Quote,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Link,
  Image,
  Table,
  Code,
  FileText,
} from 'lucide-react';

export function Editor({ value, onChange }: EditorProps) {
  const [citations, setCitations] = useState<Citation[]>([]);
  const editorRef = useRef<TipTapEditor | null>(null);
  const { thesis } = useThesis();

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.commands.setContent(value);
    }
  }, [value]);

  const handleUpdate = ({ editor }: { editor: TipTapEditor }) => {
    const content = editor.getHTML();
    onChange(content);
  };

  const toolbarItems = [
    {
      icon: <Bold className="h-4 w-4" />,
      title: 'Bold',
      action: () => editorRef.current?.chain().focus().toggleBold().run(),
    },
    {
      icon: <Italic className="h-4 w-4" />,
      title: 'Italic',
      action: () => editorRef.current?.chain().focus().toggleItalic().run(),
    },
    {
      icon: <Underline className="h-4 w-4" />,
      title: 'Underline',
      action: () => editorRef.current?.chain().focus().toggleUnderline().run(),
    },
    {
      icon: <Quote className="h-4 w-4" />,
      title: 'Quote',
      action: () => editorRef.current?.chain().focus().toggleBlockquote().run(),
    },
    {
      icon: <List className="h-4 w-4" />,
      title: 'Bullet List',
      action: () => editorRef.current?.chain().focus().toggleBulletList().run(),
    },
    {
      icon: <ListOrdered className="h-4 w-4" />,
      title: 'Numbered List',
      action: () => editorRef.current?.chain().focus().toggleOrderedList().run(),
    },
    {
      icon: <Heading1 className="h-4 w-4" />,
      title: 'Heading 1',
      action: () => editorRef.current?.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      icon: <Heading2 className="h-4 w-4" />,
      title: 'Heading 2',
      action: () => editorRef.current?.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      icon: <Heading3 className="h-4 w-4" />,
      title: 'Heading 3',
      action: () => editorRef.current?.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      icon: <Link className="h-4 w-4" />,
      title: 'Link',
      action: () => {
        const url = window.prompt('Enter URL:');
        if (url) {
          editorRef.current?.chain().focus().setLink({ href: url }).run();
        }
      },
    },
    {
      icon: <Image className="h-4 w-4" />,
      title: 'Image',
      action: () => {
        const url = window.prompt('Enter image URL:');
        if (url) {
          editorRef.current?.chain().focus().setImage({ src: url }).run();
        }
      },
    },
    {
      icon: <Table className="h-4 w-4" />,
      title: 'Table',
      action: () => editorRef.current?.chain().focus().insertTable().run(),
    },
    {
      icon: <Code className="h-4 w-4" />,
      title: 'Code Block',
      action: () => editorRef.current?.chain().focus().toggleCodeBlock().run(),
    },
    {
      icon: <FileText className="h-4 w-4" />,
      title: 'Clear Format',
      action: () => editorRef.current?.chain().focus().clearNodes().unsetAllMarks().run(),
    },
    {
      icon: <Undo className="h-4 w-4" />,
      title: 'Undo',
      action: () => editorRef.current?.chain().focus().undo().run(),
    },
    {
      icon: <Redo className="h-4 w-4" />,
      title: 'Redo',
      action: () => editorRef.current?.chain().focus().redo().run(),
    },
  ];

  return (
    <div className="relative">
      <EditorProvider
        onUpdate={handleUpdate}
        editorRef={editorRef}
        content={value}
      >
        <div className="border border-input rounded-lg">
          <Toolbar>
            {toolbarItems.map((item, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={item.action}
                title={item.title}
              >
                {item.icon}
              </Button>
            ))}
          </Toolbar>
          <EditorContent editor={editorRef.current} />
        </div>
      </EditorProvider>

      <CitationManager
        citations={citations}
        onCitationCreate={(citation) => {
          setCitations(prev => [...prev, citation]);
        }}
        onCitationUpdate={(citation) => {
          setCitations(prev => 
            prev.map(c => c.id === citation.id ? citation : c)
          );
        }}
        onCitationDelete={(citation) => {
          setCitations(prev => prev.filter(c => c.id !== citation.id));
        }}
        thesisId={thesis?.id}
      />
    </div>
  );
}
