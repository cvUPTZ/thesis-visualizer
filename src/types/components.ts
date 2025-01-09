import { Section, Reference, Citation } from './thesis';

export interface SectionProps {
  section: Section;
  isActive: boolean;
  onContentChange: (id: string, content: string) => void;
  onTitleChange: (id: string, title: string) => void;
}

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
  onCitationCreate: (citation: Citation) => void;
  onCitationUpdate: (citation: Citation) => void;
  onCitationDelete: (citation: Citation) => void;
  thesisId: string;
}

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  thesis_id: string;
  created_at: string;
}

export interface Notification {
  id: string;
  message: string;
  read: boolean;
  thesis_id: string;
  user_id: string;
  created_at: string;
}