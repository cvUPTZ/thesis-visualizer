import { 
  BookOpen, 
  FileText, 
  ListTodo, 
  Image, 
  Table, 
  BookMarked,
  Library,
  LayoutDashboard,
  BookText,
  Settings,
  ChevronRight
} from 'lucide-react';
import { ThesisSectionType } from '@/types/thesis';

interface SectionTypeConfig {
  icon: any;
  label: string;
  description: string;
  required: boolean;
  order: number;
  group: 'frontMatter' | 'mainContent' | 'backMatter';
}

export const SectionTypes: Record<ThesisSectionType, SectionTypeConfig> = {
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
    icon: ChevronRight,
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
  },
  'list-of-figures': {
    icon: Image,
    label: 'List of Figures',
    description: 'List of figures in the thesis',
    required: false,
    order: 13,
    group: 'frontMatter'
  },
  'list-of-tables': {
    icon: Table,
    label: 'List of Tables',
    description: 'List of tables in the thesis',
    required: false,
    order: 14,
    group: 'frontMatter'
  },
  'list-of-abbreviations': {
    icon: ListTodo,
    label: 'List of Abbreviations',
    description: 'List of abbreviations used',
    required: false,
    order: 15,
    group: 'frontMatter'
  },
  'general-introduction': {
    icon: BookOpen,
    label: 'General Introduction',
    description: 'General introduction to the thesis',
    required: false,
    order: 16,
    group: 'mainContent'
  },
  'detailed-toc': {
    icon: ListTodo,
    label: 'Detailed Table of Contents',
    description: 'Detailed table of contents',
    required: false,
    order: 17,
    group: 'frontMatter'
  }
} as const;

export const getSectionConfig = (type: ThesisSectionType): SectionTypeConfig => {
  return SectionTypes[type];
};

export const getSectionsByGroup = (group: 'frontMatter' | 'mainContent' | 'backMatter') => {
  return Object.entries(SectionTypes)
    .filter(([_, config]) => config.group === group)
    .map(([type]) => ({ type: type as ThesisSectionType }));
};