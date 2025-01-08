export interface Citation {
  id: string;
  text: string;
  author: string;
  year: number;
}

export interface CitationManagerProps {
  citations: Citation[];
  onAddCitation: (citation: any) => void;
  onRemoveCitation: (id: string) => void;
  onUpdateCitation: (citation: any) => void;
}
