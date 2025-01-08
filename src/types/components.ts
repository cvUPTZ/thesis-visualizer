import { Citation, Reference, Table, Figure } from './thesis';

export interface CitationManagerProps {
  citations: Citation[];
  onAddCitation: (citation: Citation) => void;
  onRemoveCitation: (id: string) => void;
  onUpdateCitation: (citation: Citation) => void;
}

export interface ReferenceManagerProps {
  items: Reference[];
  onAdd: (reference: Reference) => void;
  onRemove: (id: string) => void;
  onUpdate: (reference: Reference) => void;
}

export interface TableManagerProps {
  tables: Table[];
  onUpdateTable: (table: Table) => void;
  onRemoveTable: (id: string) => void;
  onAddTable: (table: Table) => void;
}

export interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export interface FigureManagerProps {
  figures: Figure[];
  onAddFigure: (figure: Figure) => void;
  onRemoveFigure: (id: string) => void;
  onUpdateFigure: (figure: Figure) => void;
}

export interface CollaboratorProps {
  thesisId: string;
  collaborators: any[];
  canManageCollaborators: boolean;
  isAdmin: boolean;
  thesisTitle: string;
}

export interface NotificationProps {
  notification: {
    id: string;
    message: string;
    created_at: string;
    read: boolean;
  };
  onMarkAsRead: (id: string) => void;
}

export interface CommentProps {
  comment: {
    id: string;
    content: {
      text: string;
    };
    created_at: string;
    reviewer_id: string;
    status: 'pending' | 'resolved';
  };
  onResolve: (id: string) => void;
  onReply: (id: string, content: string) => void;
  onDelete: (id: string) => void;
}