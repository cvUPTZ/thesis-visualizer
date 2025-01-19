import { 
  BookOpen, 
  FileText, 
  ListTodo, 
  Image, 
  Table, 
  BookMarked,
  Library,
  LayoutDashboard
} from 'lucide-react';

export const SectionTypes = {
  'title': {
    icon: FileText,
    label: 'Title',
    description: 'The title of the thesis',
    required: true,
    order: 1
  },
  'table-of-contents': {
    icon: ListTodo,
    label: 'Table of Contents',
    description: 'A list of sections in the thesis',
    required: true,
    order: 2
  },
  'acknowledgments': {
    icon: BookMarked,
    label: 'Acknowledgments',
    description: 'Acknowledgments section',
    required: false,
    order: 3
  },
  'abstract': {
    icon: BookOpen,
    label: 'Abstract',
    description: 'Abstract of the thesis',
    required: true,
    order: 4
  },
  'chapter': {
    icon: BookOpen,
    label: 'Chapter',
    description: 'A chapter in the thesis',
    required: false,
    order: 4
  }
} as const;

export type SectionType = keyof typeof SectionTypes;
