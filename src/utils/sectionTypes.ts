import { ThesisSectionType } from '@/types/thesis';
import {
  BookOpen, FileText, GraduationCap, FlaskConical, 
  BarChart, MessageCircle, BookmarkPlus, FolderOpen,
  FileQuestion, Target, Lightbulb, PenTool, 
  ClipboardList, FileSearch, Database, ScrollText
} from 'lucide-react';

export interface SectionTypeConfig {
  type: ThesisSectionType;
  icon: typeof BookOpen;
  label: string;
  group: 'frontMatter' | 'mainContent' | 'backMatter';
  order: number;
}

export const SECTION_TYPES: Record<ThesisSectionType, SectionTypeConfig> = {
  'title': { type: 'title', icon: BookOpen, label: 'Title', group: 'frontMatter', order: 1 },
  'acknowledgments': { type: 'acknowledgments', icon: FileText, label: 'Acknowledgments', group: 'frontMatter', order: 2 },
  'abstract': { type: 'abstract', icon: ScrollText, label: 'Abstract', group: 'frontMatter', order: 3 },
  'table-of-contents': { type: 'table-of-contents', icon: ClipboardList, label: 'Table of Contents', group: 'frontMatter', order: 4 },
  
  'general-introduction': { type: 'general-introduction', icon: BookOpen, label: 'General Introduction', group: 'mainContent', order: 1 },
  'general-context': { type: 'general-context', icon: GraduationCap, label: 'General Context', group: 'mainContent', order: 2 },
  'problem-statement': { type: 'problem-statement', icon: Target, label: 'Problem Statement', group: 'mainContent', order: 3 },
  'research-questions': { type: 'research-questions', icon: FileQuestion, label: 'Research Questions', group: 'mainContent', order: 4 },
  'objectives': { type: 'objectives', icon: Target, label: 'Objectives', group: 'mainContent', order: 5 },
  'hypotheses': { type: 'hypotheses', icon: Lightbulb, label: 'Hypotheses', group: 'mainContent', order: 6 },
  'thesis-structure': { type: 'thesis-structure', icon: ClipboardList, label: 'Thesis Structure', group: 'mainContent', order: 7 },
  'literature-review': { type: 'literature-review', icon: FileSearch, label: 'Literature Review', group: 'mainContent', order: 8 },
  'methodology': { type: 'methodology', icon: FlaskConical, label: 'Methodology', group: 'mainContent', order: 9 },
  'results': { type: 'results', icon: BarChart, label: 'Results', group: 'mainContent', order: 10 },
  'discussion': { type: 'discussion', icon: MessageCircle, label: 'Discussion', group: 'mainContent', order: 11 },
  'conclusion': { type: 'conclusion', icon: BookmarkPlus, label: 'Conclusion', group: 'mainContent', order: 12 },
  
  'bibliography': { type: 'bibliography', icon: Database, label: 'Bibliography', group: 'backMatter', order: 1 },
  'appendix': { type: 'appendix', icon: FolderOpen, label: 'Appendix', group: 'backMatter', order: 2 },
  'custom': { type: 'custom', icon: PenTool, label: 'Custom Section', group: 'mainContent', order: 99 },
  
  // Add remaining types with appropriate configurations
  'theoretical-framework': { type: 'theoretical-framework', icon: FileSearch, label: 'Theoretical Framework', group: 'mainContent', order: 13 },
  'main-theories': { type: 'main-theories', icon: Lightbulb, label: 'Main Theories', group: 'mainContent', order: 14 },
  'key-concepts': { type: 'key-concepts', icon: Target, label: 'Key Concepts', group: 'mainContent', order: 15 },
  'state-of-art': { type: 'state-of-art', icon: BarChart, label: 'State of Art', group: 'mainContent', order: 16 },
  'critical-synthesis': { type: 'critical-synthesis', icon: MessageCircle, label: 'Critical Synthesis', group: 'mainContent', order: 17 },
  'conceptual-framework': { type: 'conceptual-framework', icon: ClipboardList, label: 'Conceptual Framework', group: 'mainContent', order: 18 },
  'analysis-model': { type: 'analysis-model', icon: BarChart, label: 'Analysis Model', group: 'mainContent', order: 19 },
  'selected-variables': { type: 'selected-variables', icon: Target, label: 'Selected Variables', group: 'mainContent', order: 20 },
  'hypothetical-relationships': { type: 'hypothetical-relationships', icon: Lightbulb, label: 'Hypothetical Relationships', group: 'mainContent', order: 21 },
  'reference-framework': { type: 'reference-framework', icon: FileSearch, label: 'Reference Framework', group: 'mainContent', order: 22 },
  'research-design': { type: 'research-design', icon: PenTool, label: 'Research Design', group: 'mainContent', order: 23 },
  'methodological-approach': { type: 'methodological-approach', icon: FlaskConical, label: 'Methodological Approach', group: 'mainContent', order: 24 },
  'population-sample': { type: 'population-sample', icon: Database, label: 'Population Sample', group: 'mainContent', order: 25 },
  'research-field': { type: 'research-field', icon: Target, label: 'Research Field', group: 'mainContent', order: 26 },
  'data-collection': { type: 'data-collection', icon: Database, label: 'Data Collection', group: 'mainContent', order: 27 },
  'research-protocol': { type: 'research-protocol', icon: ClipboardList, label: 'Research Protocol', group: 'mainContent', order: 28 },
  'collection-procedures': { type: 'collection-procedures', icon: FlaskConical, label: 'Collection Procedures', group: 'mainContent', order: 29 },
  'analysis-methods': { type: 'analysis-methods', icon: BarChart, label: 'Analysis Methods', group: 'mainContent', order: 30 },
  'validity-reliability': { type: 'validity-reliability', icon: Target, label: 'Validity & Reliability', group: 'mainContent', order: 31 },
  'ethical-considerations': { type: 'ethical-considerations', icon: MessageCircle, label: 'Ethical Considerations', group: 'mainContent', order: 32 },
  'descriptive-analysis': { type: 'descriptive-analysis', icon: BarChart, label: 'Descriptive Analysis', group: 'mainContent', order: 33 },
  'statistical-tests': { type: 'statistical-tests', icon: BarChart, label: 'Statistical Tests', group: 'mainContent', order: 34 },
  'hypothesis-testing': { type: 'hypothesis-testing', icon: Target, label: 'Hypothesis Testing', group: 'mainContent', order: 35 },
  'results-summary': { type: 'results-summary', icon: ClipboardList, label: 'Results Summary', group: 'mainContent', order: 36 },
  'results-interpretation': { type: 'results-interpretation', icon: MessageCircle, label: 'Results Interpretation', group: 'mainContent', order: 37 },
  'literature-comparison': { type: 'literature-comparison', icon: FileSearch, label: 'Literature Comparison', group: 'mainContent', order: 38 },
  'theoretical-implications': { type: 'theoretical-implications', icon: Lightbulb, label: 'Theoretical Implications', group: 'mainContent', order: 39 },
  'practical-implications': { type: 'practical-implications', icon: Target, label: 'Practical Implications', group: 'mainContent', order: 40 },
  'study-limitations': { type: 'study-limitations', icon: MessageCircle, label: 'Study Limitations', group: 'mainContent', order: 41 },
  'general-summary': { type: 'general-summary', icon: ClipboardList, label: 'General Summary', group: 'mainContent', order: 42 },
  'main-contributions': { type: 'main-contributions', icon: Target, label: 'Main Contributions', group: 'mainContent', order: 43 },
  'overall-limitations': { type: 'overall-limitations', icon: MessageCircle, label: 'Overall Limitations', group: 'mainContent', order: 44 },
  'future-perspectives': { type: 'future-perspectives', icon: Lightbulb, label: 'Future Perspectives', group: 'mainContent', order: 45 },
  'recommendations': { type: 'recommendations', icon: Target, label: 'Recommendations', group: 'mainContent', order: 46 },
  'primary-sources': { type: 'primary-sources', icon: Database, label: 'Primary Sources', group: 'backMatter', order: 3 },
  'secondary-sources': { type: 'secondary-sources', icon: Database, label: 'Secondary Sources', group: 'backMatter', order: 4 },
  'electronic-sources': { type: 'electronic-sources', icon: Database, label: 'Electronic Sources', group: 'backMatter', order: 5 },
  'collection-tools': { type: 'collection-tools', icon: FlaskConical, label: 'Collection Tools', group: 'backMatter', order: 6 },
  'raw-data': { type: 'raw-data', icon: Database, label: 'Raw Data', group: 'backMatter', order: 7 },
  'detailed-analysis': { type: 'detailed-analysis', icon: BarChart, label: 'Detailed Analysis', group: 'backMatter', order: 8 },
  'supporting-documents': { type: 'supporting-documents', icon: FileText, label: 'Supporting Documents', group: 'backMatter', order: 9 },
  'reference-tables': { type: 'reference-tables', icon: Database, label: 'Reference Tables', group: 'backMatter', order: 10 },
  'index': { type: 'index', icon: ClipboardList, label: 'Index', group: 'backMatter', order: 11 },
  'glossary': { type: 'glossary', icon: BookOpen, label: 'Glossary', group: 'backMatter', order: 12 },
  'detailed-toc': { type: 'detailed-toc', icon: ClipboardList, label: 'Detailed TOC', group: 'backMatter', order: 13 },
  'list-of-figures': { type: 'list-of-figures', icon: FileText, label: 'List of Figures', group: 'frontMatter', order: 5 },
  'list-of-tables': { type: 'list-of-tables', icon: FileText, label: 'List of Tables', group: 'frontMatter', order: 6 },
  'list-of-abbreviations': { type: 'list-of-abbreviations', icon: FileText, label: 'List of Abbreviations', group: 'frontMatter', order: 7 }
};

export const getSectionConfig = (type: ThesisSectionType): SectionTypeConfig => {
  const config = SECTION_TYPES[type];
  if (!config) {
    console.error(`No configuration found for section type: ${type}`);
    return SECTION_TYPES.custom;
  }
  return config;
};

export const getSectionsByGroup = (group: 'frontMatter' | 'mainContent' | 'backMatter'): SectionTypeConfig[] => {
  return Object.values(SECTION_TYPES)
    .filter(config => config.group === group)
    .sort((a, b) => a.order - b.order);
};