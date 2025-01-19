export type ThesisSectionType = 
  | 'title'
  | 'acknowledgments'
  | 'abstract'
  | 'table-of-contents'
  | 'list-of-figures'
  | 'list-of-tables'
  | 'list-of-abbreviations'
  | 'general-introduction'
  | 'general-context'
  | 'problem-statement'
  | 'research-questions'
  | 'objectives'
  | 'hypotheses'
  | 'thesis-structure'
  | 'literature-review'
  | 'theoretical-framework'
  | 'main-theories'
  | 'key-concepts'
  | 'state-of-art'
  | 'critical-synthesis'
  | 'conceptual-framework'
  | 'analysis-model'
  | 'selected-variables'
  | 'hypothetical-relationships'
  | 'reference-framework'
  | 'methodology'
  | 'research-design'
  | 'methodological-approach'
  | 'population-sample'
  | 'research-field'
  | 'data-collection'
  | 'research-protocol'
  | 'collection-procedures'
  | 'analysis-methods'
  | 'validity-reliability'
  | 'ethical-considerations'
  | 'results'
  | 'descriptive-analysis'
  | 'statistical-tests'
  | 'hypothesis-testing'
  | 'results-summary'
  | 'discussion'
  | 'results-interpretation'
  | 'literature-comparison'
  | 'theoretical-implications'
  | 'practical-implications'
  | 'study-limitations'
  | 'conclusion'
  | 'general-summary'
  | 'main-contributions'
  | 'overall-limitations'
  | 'future-perspectives'
  | 'recommendations'
  | 'bibliography'
  | 'primary-sources'
  | 'secondary-sources'
  | 'electronic-sources'
  | 'appendix'
  | 'collection-tools'
  | 'raw-data'
  | 'detailed-analysis'
  | 'supporting-documents'
  | 'reference-tables'
  | 'index'
  | 'glossary'
  | 'detailed-toc';

export interface Section {
  id: string;
  title: string;
  content: string;
  type: ThesisSectionType;
  order: number;
  required?: boolean;
  figures: Figure[];
  tables: Table[];
  citations: Citation[];
  references?: Reference[];
  footnotes?: Footnote[];
}

export interface Chapter {
  id: string;
  title: string;
  sections: Section[];
}

export interface ThesisMetadata {
  universityName: string;
  departmentName: string;
  authorName: string;
  thesisDate: string;
  committeeMembers: string[];
}

export interface Thesis {
  id: string;
  metadata: ThesisMetadata;
  frontMatter: Section[];
  chapters: Chapter[];
  backMatter: Section[];
}
