import { Citation } from './thesis';

export interface CitationManagerProps {
  citations: Citation[];
  onCitationSelect?: (citation: Citation | null) => void;
  selectedCitation?: Citation | null;
  onCitationCreate?: (citation: Citation) => void;
  onCitationUpdate?: (citation: Citation) => void;
  onCitationDelete?: (citation: Citation) => void;
  onAddCitation: (citation: Citation) => void;
  onRemoveCitation: (id: string) => void;
  onUpdateCitation: (citation: Citation) => void;
  thesisId: string;
}
