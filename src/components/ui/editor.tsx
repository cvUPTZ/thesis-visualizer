import React, { useState, useEffect } from 'react';
import { Editor as TipTapEditor, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import { EditorProps } from '@/types/components';
import { Citation } from '@/types/thesis';
import { CitationManager } from '@/components/CitationManager';
import { useThesis } from '@/hooks/useThesis';
import { Button } from './button';
import { Toolbar } from './editor/toolbar';
import { EditorContent } from './editor/editor-content';
import { EditorProvider } from './editor/editor-provider';
import {
  Bold, Italic, Underline as UnderlineIcon, Quote, List, ListOrdered,
  Heading1, Heading2, Heading3, Undo, Redo, Link as LinkIcon,
  Image as ImageIcon, Table as TableIcon, Code, FileText
} from 'lucide-react';

export function Editor({ value, onChange }: EditorProps) {
  const [citations, setCitations] = useState<Citation[]>([]);
  const { thesis } = useThesis();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Image,
      Table
    ],
    content: value || '', // Provide a default empty string
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    }
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || ''); // Provide a default empty string
    }
  }, [value, editor]);

  const toolbarItems = [
    {
      icon: <Bold className="h-4 w-4" />,
      title: 'Bold',
      action: () => editor?.chain().focus().toggleBold().run(),
    },
    {
      icon: <Italic className="h-4 w-4" />,
      title: 'Italic',
      action: () => editor?.chain().focus().toggleItalic().run(),
    },
    {
      icon: <UnderlineIcon className="h-4 w-4" />,
      title: 'Underline',
      action: () => editor?.chain().focus().toggleUnderline().run(),
    },
    {
      icon: <Quote className="h-4 w-4" />,
      title: 'Quote',
      action: () => editor?.chain().focus().toggleBlockquote().run(),
    },
    {
      icon: <List className="h-4 w-4" />,
      title: 'Bullet List',
      action: () => editor?.chain().focus().toggleBulletList().run(),
    },
    {
      icon: <ListOrdered className="h-4 w-4" />,
      title: 'Numbered List',
      action: () => editor?.chain().focus().toggleOrderedList().run(),
    },
    {
      icon: <Heading1 className="h-4 w-4" />,
      title: 'Heading 1',
      action: () => editor?.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      icon: <Heading2 className="h-4 w-4" />,
      title: 'Heading 2',
      action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(),
    },
    {
      icon: <Heading3 className="h-4 w-4" />,
      title: 'Heading 3',
      action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(),
    },
    {
      icon: <LinkIcon className="h-4 w-4" />,
      title: 'Link',
      action: () => {
        const url = window.prompt('Enter URL:');
        if (url) {
          editor?.chain().focus().setLink({ href: url }).run();
        }
      },
    },
    {
      icon: <ImageIcon className="h-4 w-4" />,
      title: 'Image',
      action: () => {
        const url = window.prompt('Enter image URL:');
        if (url) {
          editor?.chain().focus().setImage({ src: url }).run();
        }
      },
    },
    {
      icon: <TableIcon className="h-4 w-4" />,
      title: 'Table',
      action: () => editor?.chain().focus().insertTable().run(),
    },
    {
      icon: <Code className="h-4 w-4" />,
      title: 'Code Block',
      action: () => editor?.chain().focus().toggleCodeBlock().run(),
    },
    {
      icon: <FileText className="h-4 w-4" />,
      title: 'Clear Format',
      action: () => editor?.chain().focus().clearNodes().unsetAllMarks().run(),
    },
    {
      icon: <Undo className="h-4 w-4" />,
      title: 'Undo',
      action: () => editor?.chain().focus().undo().run(),
    },
    {
      icon: <Redo className="h-4 w-4" />,
      title: 'Redo',
      action: () => editor?.chain().focus().redo().run(),
    },
  ];

  return (
    <div className="relative">
      <div className="border border-input rounded-lg">
        <Toolbar editor={editor}>
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
        <EditorContent editor={editor} />
      </div>

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
        thesisId={thesis?.id || ''}
      />
    </div>
  );
}