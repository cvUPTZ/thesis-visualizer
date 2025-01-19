export type ThesisSectionType = 
  | 'title'
  | 'acknowledgments'
  | 'abstract'
  | 'table-of-contents'
  | 'list-of-figures'
  | 'list-of-tables'
  | 'list-of-abbreviations'
  | 'general-introduction'
  | 'problem-statement'
  | 'research-questions'
  | 'objectives'
  | 'hypotheses'
  | 'thesis-structure'
  | 'literature-review'
  | 'theoretical-framework'
  | 'conceptual-framework'
  | 'methodology'
  | 'research-design'
  | 'research-protocol'
  | 'results'
  | 'discussion'
  | 'conclusion'
  | 'bibliography'
  | 'appendix'
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
