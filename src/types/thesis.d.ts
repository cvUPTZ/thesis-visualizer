export interface Citation {
  id: string;
  text: string;
  authors: string[];
  type: string;
  created_at: string;
  updated_at: string;
}

export interface CitationManagerProps {
  citations: Citation[];
  onCitationSelect?: (citation: Citation) => void;
  selectedCitation?: Citation | null;
  onCitationCreate?: (citation: Citation) => void;
  onCitationUpdate?: (citation: Citation) => void;
  onCitationDelete?: (citation: Citation) => void;
  thesisId: string;
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
