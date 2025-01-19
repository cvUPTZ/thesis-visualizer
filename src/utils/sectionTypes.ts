import { 
  BookOpen, 
  FileText, 
  ListTodo, 
  Image, 
  Table, 
  BookMarked,
  Library,
  LayoutDashboard,
  BookText
} from 'lucide-react';
import { ThesisSectionType } from '@/types/thesis';

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
    icon: BookText,
    label: 'Chapter',
    description: 'A chapter in the thesis',
    required: false,
    order: 5,
    group: 'mainContent'
  },
  'introduction': {
    icon: BookOpen,
    label: 'Introduction',
    description: 'Introduction chapter',
    required: true,
    order: 6,
    group: 'mainContent'
  },
  'methodology': {
    icon: BookOpen,
    label: 'Methodology',
    description: 'Methodology chapter',
    required: true,
    order: 7,
    group: 'mainContent'
  },
  'results': {
    icon: BookOpen,
    label: 'Results',
    description: 'Results chapter',
    required: true,
    order: 8,
    group: 'mainContent'
  },
  'discussion': {
    icon: BookOpen,
    label: 'Discussion',
    description: 'Discussion chapter',
    required: true,
    order: 9,
    group: 'mainContent'
  },
  'conclusion': {
    icon: BookOpen,
    label: 'Conclusion',
    description: 'Conclusion chapter',
    required: true,
    order: 10,
    group: 'mainContent'
  },
  'bibliography': {
    icon: Library,
    label: 'Bibliography',
    description: 'Bibliography section',
    required: true,
    order: 11,
    group: 'backMatter'
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
  return SectionTypes[type as keyof typeof SectionTypes];
};

export const getSectionsByGroup = (group: 'frontMatter' | 'mainContent' | 'backMatter') => {
  return Object.entries(SectionTypes)
    .filter(([_, config]) => config.group === group)
    .map(([type]) => ({ type: type as ThesisSectionType }));
};