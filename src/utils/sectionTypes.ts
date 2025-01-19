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
  | 'chapter'
  | 'introduction'
  | 'methodology'
  | 'results'
  | 'discussion'
  | 'conclusion'
  | 'bibliography'
  | 'custom';

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
  'introduction': {
    icon: BookOpen,
    label: 'Introduction',
    description: 'Introduction chapter',
    required: true,
    order: 5,
    group: 'mainContent'
  },
  'methodology': {
    icon: BookOpen,
    label: 'Methodology',
    description: 'Methodology chapter',
    required: true,
    order: 6,
    group: 'mainContent'
  },
  'results': {
    icon: BookOpen,
    label: 'Results',
    description: 'Results chapter',
    required: true,
    order: 7,
    group: 'mainContent'
  },
  'discussion': {
    icon: BookOpen,
    label: 'Discussion',
    description: 'Discussion chapter',
    required: true,
    order: 8,
    group: 'mainContent'
  },
  'conclusion': {
    icon: BookOpen,
    label: 'Conclusion',
    description: 'Conclusion chapter',
    required: true,
    order: 9,
    group: 'mainContent'
  },
  'bibliography': {
    icon: Library,
    label: 'Bibliography',
    description: 'Bibliography section',
    required: true,
    order: 10,
    group: 'backMatter'
  },
  'chapter': {
    icon: BookOpen,
    label: 'Chapter',
    description: 'A chapter in the thesis',
    required: false,
    order: 11,
    group: 'mainContent'
  },
  'custom': {
    icon: FileText,
    label: 'Custom Section',
    description: 'A custom section',
    required: false,
    order: 12,
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