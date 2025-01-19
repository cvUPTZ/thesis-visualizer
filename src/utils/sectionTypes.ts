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

export type ThesisSectionType = 
  | 'title'
  | 'table-of-contents'
  | 'acknowledgments'
  | 'abstract'
  | 'chapter';

export const SectionTypes = {
  'title': {
    icon: FileText,
    label: 'Title',
    description: 'The title of the thesis',
    required: true,
    order: 1,
    group: 'frontMatter'
  },
  'table-of-contents': {
    icon: ListTodo,
    label: 'Table of Contents',
    description: 'A list of sections in the thesis',
    required: true,
    order: 2,
    group: 'frontMatter'
  },
  'acknowledgments': {
    icon: BookMarked,
    label: 'Acknowledgments',
    description: 'Acknowledgments section',
    required: false,
    order: 3,
    group: 'frontMatter'
  },
  'abstract': {
    icon: BookOpen,
    label: 'Abstract',
    description: 'Abstract of the thesis',
    required: true,
    order: 4,
    group: 'frontMatter'
  },
  'chapter': {
    icon: BookOpen,
    label: 'Chapter',
    description: 'A chapter in the thesis',
    required: false,
    order: 4,
    group: 'mainContent'
  }
} as const;

export const getSectionConfig = (type: ThesisSectionType) => {
  return SectionTypes[type];
};

export const getSectionsByGroup = (group: 'frontMatter' | 'mainContent' | 'backMatter') => {
  return Object.entries(SectionTypes)
    .filter(([_, config]) => config.group === group)
    .map(([type]) => ({ type: type as ThesisSectionType }));
};