import { ThesisSectionType } from '@/types/thesis';
import { 
  BookOpen, 
  ListOrdered, 
  Image, 
  Table, 
  Heart, 
  FileText, 
  BookMarked,
  GraduationCap,
  FolderOpen,
  BookmarkPlus,
  ListChecks,
  FileStack,
  BookOpenCheck,
  ScrollText,
  ClipboardCheck,
  BookCheck
} from 'lucide-react';

export interface SectionTypeConfig {
  label: string;
  icon: any;
  description: string;
  group: 'frontMatter' | 'mainContent' | 'backMatter';
  type: ThesisSectionType;
}

export const sectionTypes: Record<ThesisSectionType, SectionTypeConfig> = {
  'title': {
    label: 'Title Page',
    icon: BookOpen,
    description: 'The main title page of your thesis',
    group: 'frontMatter',
    type: 'title'
  },
  'table-of-contents': {
    label: 'Table of Contents',
    icon: ListOrdered,
    description: 'Organized list of thesis contents',
    group: 'frontMatter',
    type: 'table-of-contents'
  },
  'list-of-figures': {
    label: 'List of Figures',
    icon: Image,
    description: 'Catalog of all figures',
    group: 'frontMatter',
    type: 'list-of-figures'
  },
  'list-of-tables': {
    label: 'List of Tables',
    icon: Table,
    description: 'Catalog of all tables',
    group: 'frontMatter',
    type: 'list-of-tables'
  },
  'acknowledgments': {
    label: 'Acknowledgments',
    icon: Heart,
    description: 'Thank you notes and acknowledgments',
    group: 'frontMatter',
    type: 'acknowledgments'
  },
  'abstract': {
    label: 'Abstract',
    icon: FileText,
    description: 'Brief summary of your thesis',
    group: 'frontMatter',
    type: 'abstract'
  },
  'list-of-abbreviations': {
    label: 'List of Abbreviations',
    icon: ListChecks,
    description: 'Glossary of abbreviations used',
    group: 'frontMatter',
    type: 'list-of-abbreviations'
  },
  'general-introduction': {
    label: 'General Introduction',
    icon: BookMarked,
    description: 'Main introduction to your thesis',
    group: 'mainContent',
    type: 'general-introduction'
  },
  'introduction': {
    label: 'Introduction',
    icon: BookOpen,
    description: 'Chapter introduction',
    group: 'mainContent',
    type: 'introduction'
  },
  'literature-review': {
    label: 'Literature Review',
    icon: BookOpen,
    description: 'Review of existing literature',
    group: 'mainContent',
    type: 'literature-review'
  },
  'methodology': {
    label: 'Methodology',
    icon: GraduationCap,
    description: 'Research methods and approach',
    group: 'mainContent',
    type: 'methodology'
  },
  'results': {
    label: 'Results',
    icon: FileStack,
    description: 'Research findings and data',
    group: 'mainContent',
    type: 'results'
  },
  'discussion': {
    label: 'Discussion',
    icon: BookmarkPlus,
    description: 'Analysis and interpretation',
    group: 'mainContent',
    type: 'discussion'
  },
  'conclusion': {
    label: 'Conclusion',
    icon: BookMarked,
    description: 'Chapter conclusion',
    group: 'mainContent',
    type: 'conclusion'
  },
  'references': {
    label: 'References',
    icon: ClipboardCheck,
    description: 'Citations and references',
    group: 'backMatter',
    type: 'references'
  },
  'bibliography': {
    label: 'Bibliography',
    icon: BookOpenCheck,
    description: 'List of references',
    group: 'backMatter',
    type: 'bibliography'
  },
  'appendix': {
    label: 'Appendix',
    icon: ScrollText,
    description: 'Additional materials',
    group: 'backMatter',
    type: 'appendix'
  },
  'custom': {
    label: 'Custom Section',
    icon: FileText,
    description: 'Custom section type',
    group: 'mainContent',
    type: 'custom'
  }
};

export const getSectionsByGroup = (group: 'frontMatter' | 'mainContent' | 'backMatter'): SectionTypeConfig[] => {
  return Object.entries(sectionTypes)
    .filter(([_, config]) => config.group === group)
    .map(([type, config]) => ({
      ...config,
      type: type as ThesisSectionType
    }));
};

export const getSectionConfig = (type: ThesisSectionType): SectionTypeConfig => {
  const config = sectionTypes[type];
  if (!config) {
    console.error('No configuration found for section type:', type);
    return sectionTypes.custom;
  }
  return {
    ...config,
    type
  };
};
