export interface SectionProps {
  content: string;
  title: string;
  id: string;
  onUpdate: (content: string) => void;
}

export interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export interface ReferenceManagerProps {
  items: Array<{
    id: string;
    title: string;
    authors: string[];
    year: number;
    source: string;
  }>;
  onAdd: (reference: any) => void;
  onRemove: (id: string) => void;
  onUpdate: (reference: any) => void;
}

export interface CitationManagerProps {
  citations: Array<{
    id: string;
    title: string;
    author: string;
    year: number;
    source: string;
  }>;
  onAddCitation: (citation: any) => void;
  onRemoveCitation: (id: string) => void;
  onUpdateCitation: (citation: any) => void;
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