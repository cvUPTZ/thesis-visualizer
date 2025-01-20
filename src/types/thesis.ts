export interface Citation {
  id: string;
  text: string;
  authors: string[];
  type: string;
  created_at: string;
  updated_at: string;
  thesis_id: string;
  
  // Author Information
  author_last_names: string[];
  author_first_initials: string[];
  author_middle_initials: string[];
  
  // Date Information
  year: string;
  specific_date?: string;
  
  // Title Information
  title: string;
  container_title?: string;
  edition?: string;
  
  // Publication Information
  publisher?: string;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  doi?: string;
  url?: string;
  database?: string;
  source: string;
}

export interface CitationManagerProps {
  citations: Citation[];
  onCitationSelect?: (citation: Citation) => void;
  selectedCitation?: Citation | null;
  onCitationCreate?: (citation: Citation) => void;
  onCitationUpdate?: (citation: Citation) => void;
  onCitationDelete?: (citation: Citation) => void;
  thesisId: string;
  onAddCitation?: (citation: any) => void;
  onRemoveCitation?: (id: any) => void;
  onUpdateCitation?: (citation: any) => void;
}

export interface CitationListProps {
  citations: Citation[];
  onRemove: (id: string) => void;
  onUpdate: (citation: Citation) => void;
  onPreview: (citation: Citation) => void;
}

export interface CitationSearchProps {
  onCitationSelect: (citation: Citation) => void;
}

export interface CitationPreviewProps {
  citation: Citation;
  onClose: () => void;
  onEdit: (citation: Citation) => void;
  onDelete: (citation: Citation) => void;
}

export type ReferenceStyle = 'APA' | 'MLA' | 'Chicago' | 'Harvard';

export interface ThesisMetadata {
  description: string;
  keywords: string[];
  createdAt: string;
  universityName?: string;
  departmentName?: string;
  authorName?: string;
  thesisDate?: string;
  committeeMembers?: string[];
  referenceStyle?: ReferenceStyle;
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

export interface Reference {
  id: string;
  title: string;
  text: string;
  source: string;
  authors: string[];
  year: string;
  type: 'article' | 'book' | 'conference' | 'thesis' | 'website' | 'other';
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

export type ThesisSectionType = 
  | 'title'
  | 'preface'
  | 'acknowledgments'
  | 'abstract'
  | 'table-of-contents'
  | 'list-of-figures'
  | 'list-of-tables'
  | 'abbreviations'
  | 'glossary'
  | 'introduction'
  | 'theoretical-framework'
  | 'methodology'
  | 'empirical-study'
  | 'results'
  | 'discussion'
  | 'conclusion'
  | 'recommendations'
  | 'postface'
  | 'references'
  | 'appendix'
  | 'advice'
  | 'custom';
