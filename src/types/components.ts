import { Citation } from './thesis';

export interface CitationManagerProps {
  citations: Citation[];
  onAddCitation: (citation: Citation) => void;
  onRemoveCitation: (id: string) => void;
  onUpdateCitation: (citation: Citation) => void;
}

export interface SectionProps {
  id: string;
  title: string;
  content: string;
  type: string;
  order: number;
}