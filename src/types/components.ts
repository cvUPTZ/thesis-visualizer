import { Section, Citation, Reference } from './thesis';

export interface SectionProps {
  section: Section;
  isActive: boolean;
  onContentChange: (id: string, content: string) => void;
  onTitleChange: (id: string, title: string) => void;
}

export interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export interface ReferenceManagerProps {
  references: Reference[];
  onAddReference: (reference: Reference) => void;
  onRemoveReference: (id: string) => void;
  onUpdateReference: (reference: Reference) => void;
}

export interface CitationManagerProps {
  citations: Citation[];
  onAddCitation: (citation: Citation) => void;
  onRemoveCitation: (id: string) => void;
  onUpdateCitation: (citation: Citation) => void;
}