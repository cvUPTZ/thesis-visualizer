export interface Citation {
  id: string;
  text: string;
  authors: string[];
  type: string;
  created_at: string;
  updated_at: string;
  
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

export interface Reference {
  id: string;
  text: string;
  title: string;
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
  specific_date?: string;
  container_title?: string;
  edition?: string;
  created_at: string;
  updated_at: string;
}
