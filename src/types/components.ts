import { BaseProps } from './common';
import { Chapter, Section, Citation, Figure, Table, Reference } from './thesis';

export interface EditorProps extends BaseProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export interface SectionProps extends BaseProps {
  section: Section;
  isActive: boolean;
  onContentChange: (id: string, content: string) => void;
  onTitleChange: (id: string, title: string) => void;
}

export interface ChapterProps extends BaseProps {
  chapter: Chapter;
  onUpdateChapter: (chapter: Chapter) => void;
}

export interface CitationProps extends BaseProps {
  citation: Citation;
  onRemove: (id: string) => void;
  onUpdate: (citation: Citation) => void;
  onPreview?: () => void;
}

export interface CitationManagerProps extends BaseProps {
  citations: Citation[];
  onCitationSelect?: (citation: Citation) => void;
  selectedCitation?: Citation | null;
  onCitationCreate?: (citation: Citation) => void;
  onCitationUpdate?: (citation: Citation) => void;
  onCitationDelete?: (citation: Citation) => void;
  thesisId: string;
}

export interface CitationListProps extends BaseProps {
  citations: Citation[];
  onRemove: (id: string) => void;
  onUpdate: (citation: Citation) => void;
  onPreview: (citation: Citation) => void;
}

export interface CitationSearchProps {
  onCitationSelect: (citation: Omit<Citation, "thesis_id">) => void;
  onSearch?: (value: string) => void;
  onFilterChange?: (value: string) => void;
  onSortFieldChange?: (field: keyof Citation) => void;
  onSortDirectionChange?: (direction: 'asc' | 'desc') => void;
  currentFilter?: string;
  currentSort?: keyof Citation;
  currentDirection?: 'asc' | 'desc';
}

export interface CitationPreviewProps {
  citation: Citation;
  onEdit?: (citation: Citation) => void;
  onUpdate?: (citation: Citation) => void;
  onRemove?: (citation: Citation) => void;
  onDelete?: (citation: Citation) => void;
  onClose?: () => void;
}

export interface FigureProps extends BaseProps {
  figure: Figure;
  onRemove: (id: string) => void;
  onUpdate: (figure: Figure) => void;
  onPreview?: () => void;
}

export interface TableProps extends BaseProps {
  table: Table;
  onRemove: (id: string) => void;
  onUpdate: (table: Table) => void;
}

export interface ReferenceProps extends BaseProps {
  reference: Reference;
  onRemove: (id: string) => void;
  onUpdate: (reference: Reference) => void;
}

export interface ReferenceManagerProps extends BaseProps {
  items: Reference[];
  onAdd: (reference: Reference) => void;
  onRemove: (id: string) => void;
  onUpdate: (reference: Reference) => void;
}

export interface ManagerProps<T> extends BaseProps {
  items: T[];
  onAdd: (item: T) => void;
  onRemove: (id: string) => void;
  onUpdate: (item: T) => void;
}
