import { Reference, Citation } from './thesis';

export interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export interface ReferenceManagerProps {
  items: Reference[];
  onAdd: (reference: Reference) => void;
  onRemove: (id: string) => void;
  onUpdate: (reference: Reference) => void;
}

export interface CitationManagerProps {
  citations: Citation[];
  onAddCitation: (citation: Citation) => void;
  onRemoveCitation: (id: string) => void;
  onUpdateCitation: (citation: Citation) => void;
  thesisId: string;
}

export interface SectionProps {
  section: any;
  isActive: boolean;
  onContentChange: (content: string) => void;
  onTitleChange: (title: string) => void;
}