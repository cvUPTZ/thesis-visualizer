import { ThesisSectionType } from '@/types/thesis';
import { BookOpen, FileText, ListOrdered, Table, Image, Quote, BookmarkPlus, FileQuestion, Target, AlertTriangle, LayoutList, ChartBar, Globe, BookCheck, FileSignature, ScrollText } from 'lucide-react';

export const SectionTypes = {
  'title': 'title',
  'table-of-contents': 'table-of-contents',
  'list-of-figures': 'list-of-figures',
  'list-of-tables': 'list-of-tables',
  'acknowledgments': 'acknowledgments',
  'abstract': 'abstract',
  'list-of-abbreviations': 'list-of-abbreviations',
  'general-introduction': 'general-introduction',
  'introduction': 'introduction',
  'methodology': 'methodology',
  'results': 'results',
  'discussion': 'discussion',
  'conclusion': 'conclusion',
  'bibliography': 'bibliography',
  'appendix': 'appendix',
  'custom': 'custom',
  'references': 'references',
  'chapter': 'chapter',
  'research-questions': 'research-questions',
  'hypotheses': 'hypotheses',
  'objectives': 'objectives',
  'problem-statement': 'problem-statement',
  'thesis-structure': 'thesis-structure',
  'statistical-tests': 'statistical-tests',
  'general-context': 'general-context',
  'general-conclusion': 'general-conclusion',
  'statement': 'statement',
  'preface': 'preface'
} as const;

export const getSectionConfig = (type: ThesisSectionType) => {
  const configs = {
    'title': { icon: FileText, label: 'Title Page' },
    'table-of-contents': { icon: ListOrdered, label: 'Table of Contents' },
    'list-of-figures': { icon: Image, label: 'List of Figures' },
    'list-of-tables': { icon: Table, label: 'List of Tables' },
    'acknowledgments': { icon: Quote, label: 'Acknowledgments' },
    'abstract': { icon: FileText, label: 'Abstract' },
    'list-of-abbreviations': { icon: ListOrdered, label: 'List of Abbreviations' },
    'general-introduction': { icon: BookOpen, label: 'General Introduction' },
    'introduction': { icon: BookOpen, label: 'Introduction' },
    'methodology': { icon: FileText, label: 'Methodology' },
    'results': { icon: ChartBar, label: 'Results' },
    'discussion': { icon: FileText, label: 'Discussion' },
    'conclusion': { icon: BookCheck, label: 'Conclusion' },
    'bibliography': { icon: BookmarkPlus, label: 'Bibliography' },
    'appendix': { icon: FileText, label: 'Appendix' },
    'custom': { icon: FileText, label: 'Custom Section' },
    'references': { icon: BookmarkPlus, label: 'References' },
    'chapter': { icon: BookOpen, label: 'Chapter' },
    'research-questions': { icon: FileQuestion, label: 'Research Questions' },
    'hypotheses': { icon: Target, label: 'Hypotheses' },
    'objectives': { icon: Target, label: 'Objectives' },
    'problem-statement': { icon: AlertTriangle, label: 'Problem Statement' },
    'thesis-structure': { icon: LayoutList, label: 'Thesis Structure' },
    'statistical-tests': { icon: ChartBar, label: 'Statistical Tests' },
    'general-context': { icon: Globe, label: 'General Context' },
    'general-conclusion': { icon: BookCheck, label: 'General Conclusion' },
    'statement': { icon: FileSignature, label: 'Statement' },
    'preface': { icon: ScrollText, label: 'Preface' }
  };

  return configs[type] || configs.custom;
};

export const getSectionsByGroup = (group: 'frontMatter' | 'mainContent' | 'backMatter') => {
  const sections = {
    frontMatter: [
      { type: 'title' as ThesisSectionType },
      { type: 'abstract' as ThesisSectionType },
      { type: 'acknowledgments' as ThesisSectionType },
      { type: 'table-of-contents' as ThesisSectionType },
      { type: 'list-of-figures' as ThesisSectionType },
      { type: 'list-of-tables' as ThesisSectionType },
      { type: 'list-of-abbreviations' as ThesisSectionType },
      { type: 'preface' as ThesisSectionType }
    ],
    mainContent: [
      { type: 'chapter' as ThesisSectionType },
      { type: 'introduction' as ThesisSectionType },
      { type: 'methodology' as ThesisSectionType },
      { type: 'results' as ThesisSectionType },
      { type: 'discussion' as ThesisSectionType },
      { type: 'conclusion' as ThesisSectionType }
    ],
    backMatter: [
      { type: 'references' as ThesisSectionType },
      { type: 'bibliography' as ThesisSectionType },
      { type: 'appendix' as ThesisSectionType }
    ]
  };

  return sections[group];
};