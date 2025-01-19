export interface ThesisComment {
  id: string;
  thesis_id: string;
  section_id: string;
  reviewer_id: string;
  content: {
    text: string;
  };
  parent_id?: string;
  status: 'pending' | 'resolved';
  created_at: string;
  updated_at: string;
}

export interface CommentThread {
  comment: ThesisComment;
  replies: ThesisComment[];
}

export interface ThesisMetadata {
  description: string;
  keywords: string[];
  createdAt: string;
  universityName?: string;
  departmentName?: string;
  authorName?: string;
  thesisDate?: string;
  committeeMembers?: string[];
}

export interface Thesis {
  id: string;
  title: string;
  content?: any;
  metadata: ThesisMetadata;
  frontMatter: Section[];
  chapters: Chapter[];
  backMatter: Section[];
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Chapter {
  id: string;
  title: string;
  content?: string;
  order: number;
  sections: Section[];
  figures: Figure[];
  tables: Table[];
  footnotes: Footnote[];
}

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

export interface Footnote {
  id: string;
  content: string;
  number: number;
  created_at: string;
  updated_at: string;
}

export interface Figure {
  id: string;
  imageUrl: string;
  title: string; // Added title field
  caption: string;
  altText: string;
  number: number;
  dimensions: {
    width: number;
    height: number;
  };
}

export interface Table {
  id: string;
  title: string;
  caption?: string;
  content: string;
}

export interface Citation {
  id: string;
  text: string;
  source: string;
  authors: string[];
  year: string;
  type: 'article' | 'book' | 'conference' | 'website' | 'other';
  doi?: string;
  url?: string;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  publisher?: string;
  thesis_id: string;
  created_at: string;
  updated_at: string;
}

export interface Reference {
  id: string;
  title: string;
  text: string;
  source: string;
  authors: string[];
  year: string;
  style: 'APA' | 'MLA' | 'Chicago' | 'Vancouver' | 'Harvard';
  doi?: string;
  url?: string;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  publisher?: string;
}

export interface ThesisVersion {
  id: string;
  thesis_id: string;
  content: any;
  version_number: number;
  description?: string;
  created_at: string;
  created_by: string;
}

export enum ThesisSectionType {
  Title = 'title',
  Preface = 'preface',
  Acknowledgments = 'acknowledgments',
  Abstract = 'abstract',
  TableOfContents = 'table-of-contents',
  ListOfFigures = 'list-of-figures',
  ListOfTables = 'list-of-tables',
  Abbreviations = 'abbreviations',
  Glossary = 'glossary',
  Introduction = 'introduction',
  TheoreticalFramework = 'theoretical-framework',
  Methodology = 'methodology',
  EmpiricalStudy = 'empirical-study',
  Results = 'results',
  Discussion = 'discussion',
  Conclusion = 'conclusion',
  Recommendations = 'recommendations',
  Postface = 'postface',
  References = 'references',
  Appendix = 'appendix',
  Advice = 'advice',
  Custom = 'custom'
}
