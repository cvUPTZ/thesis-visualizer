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
  BookCheck,
  CheckCircle,
  FileCheck
} from 'lucide-react';
import { ThesisSectionType } from '@/types/thesis';

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
  'general-conclusion': {
    label: 'General Conclusion',
    icon: BookCheck,
    description: 'Final thesis conclusion',
    group: 'mainContent',
    type: 'general-conclusion'
  },
  'bibliography': {
    label: 'Bibliography',
    icon: BookOpen,
    description: 'List of references',
    group: 'backMatter',
    type: 'bibliography'
  },
  'appendix': {
    label: 'Appendix',
    icon: FolderOpen,
    description: 'Additional materials and data',
    group: 'backMatter',
    type: 'appendix'
  },
  'custom': {
    label: 'Custom Section',
    icon: FileText,
    description: 'Custom content section',
    group: 'mainContent',
    type: 'custom'
  },
  'references': {
    label: 'References',
    icon: ScrollText,
    description: 'Reference list',
    group: 'mainContent',
    type: 'references'
  },
  'chapter': {
    label: 'Chapter',
    icon: BookOpenCheck,
    description: 'Thesis chapter',
    group: 'mainContent',
    type: 'chapter'
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
    return sectionTypes.custom; // Fallback to custom section type
  }
  return {
    ...config,
    type
  };
};