export type ThesisSectionType = 
  | 'abstract'
  | 'acknowledgments'
  | 'introduction'
  | 'literature-review'
  | 'methodology'
  | 'results'
  | 'discussion'
  | 'conclusion'
  | 'references'
  | 'appendix'
  | 'table-of-contents';

export interface Section {
  id: string;
  title: string;
  content: string;
  type: ThesisSectionType;
  citations?: Citation[];
  figures?: Figure[];
  tables?: Table[];
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
