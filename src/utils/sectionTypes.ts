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
  FileStack
} from 'lucide-react';
import { ThesisSectionType } from '@/types/thesis';

export interface SectionTypeConfig {
  label: string;
  icon: any;
  description: string;
  group: 'frontMatter' | 'mainContent' | 'backMatter';
}

export const sectionTypes: Record<ThesisSectionType, SectionTypeConfig> = {
  'title': {
    label: 'Title Page',
    icon: BookOpen,
    description: 'The main title page of your thesis',
    group: 'frontMatter'
  },
  'table-of-contents': {
    label: 'Table of Contents',
    icon: ListOrdered,
    description: 'Organized list of thesis contents',
    group: 'frontMatter'
  },
  'list-of-figures': {
    label: 'List of Figures',
    icon: Image,
    description: 'Catalog of all figures',
    group: 'frontMatter'
  },
  'list-of-tables': {
    label: 'List of Tables',
    icon: Table,
    description: 'Catalog of all tables',
    group: 'frontMatter'
  },
  'acknowledgments': {
    label: 'Acknowledgments',
    icon: Heart,
    description: 'Thank you notes and acknowledgments',
    group: 'frontMatter'
  },
  'abstract': {
    label: 'Abstract',
    icon: FileText,
    description: 'Brief summary of your thesis',
    group: 'frontMatter'
  },
  'list-of-abbreviations': {
    label: 'List of Abbreviations',
    icon: ListChecks,
    description: 'Glossary of abbreviations used',
    group: 'frontMatter'
  },
  'general-introduction': {
    label: 'General Introduction',
    icon: BookMarked,
    description: 'Main introduction to your thesis',
    group: 'mainContent'
  },
  'introduction': {
    label: 'Introduction',
    icon: BookOpen,
    description: 'Chapter introduction',
    group: 'mainContent'
  },
  'methodology': {
    label: 'Methodology',
    icon: GraduationCap,
    description: 'Research methods and approach',
    group: 'mainContent'
  },
  'results': {
    label: 'Results',
    icon: FileStack,
    description: 'Research findings and data',
    group: 'mainContent'
  },
  'discussion': {
    label: 'Discussion',
    icon: BookmarkPlus,
    description: 'Analysis and interpretation',
    group: 'mainContent'
  },
  'conclusion': {
    label: 'Conclusion',
    icon: BookMarked,
    description: 'Chapter conclusion',
    group: 'mainContent'
  },
  'general-conclusion': {
    label: 'General Conclusion',
    icon: BookMarked,
    description: 'Final thesis conclusion',
    group: 'mainContent'
  },
  'bibliography': {
    label: 'Bibliography',
    icon: BookOpen,
    description: 'List of references',
    group: 'backMatter'
  },
  'appendix': {
    label: 'Appendix',
    icon: FolderOpen,
    description: 'Additional materials and data',
    group: 'backMatter'
  },
  'custom': {
    label: 'Custom Section',
    icon: FileText,
    description: 'Custom content section',
    group: 'mainContent'
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
  return sectionTypes[type];
};