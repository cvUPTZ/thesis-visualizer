import { Citation } from './thesis';

export interface CitationManagerProps {
  citations: Citation[];
  onAddCitation: (citation: any) => void;
  onRemoveCitation: (id: any) => void;
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

export interface Citation {
  id: string;
  title: string;
  author: string;
  year: number;
  source: string;
}
