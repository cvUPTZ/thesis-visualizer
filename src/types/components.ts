import { Citation, Reference } from './thesis';

export interface CitationManagerProps {
  citations: Citation[];
  onCitationSelect?: (citation: Citation) => void;
  selectedCitation?: Citation | null;
  onCitationCreate?: (citation: Citation) => void;
  onCitationUpdate?: (citation: Citation) => void;
  onCitationDelete?: (citation: Citation) => void;
  thesisId: string;
  onAddCitation?: (citation: any) => void;
  onRemoveCitation?: (id: any) => void;
  onUpdateCitation?: (citation: any) => void;
}

export interface ReferenceManagerProps {
  items: Reference[];
  onAdd: (reference: Reference) => void;
  onRemove: (id: string) => void;
  onUpdate: (reference: Reference) => void;
}

export interface SectionProps {
  section: any;
  isActive: boolean;
  onContentChange: (id: string, content: string) => void;
  onTitleChange: (id: string, title: string) => void;
}

export interface ThesisProps {
  thesis: any;
  activeSection: string;
  onSectionSelect: (id: string) => void;
}

export interface ThesisEditorProps {
  thesisId?: string;
}

export interface ThesisPreviewProps {
  thesis: any;
  language?: 'en' | 'fr';
}

export interface ThesisSidebarProps {
  sections: any[];
  activeSection: string;
  onSectionSelect: (id: string) => void;
}

export interface ThesisContentProps {
  frontMatter: any[];
  chapters: any[];
  backMatter: any[];
  activeSection: string;
  onContentChange: (id: string, content: string) => void;
  onTitleChange: (id: string, title: string) => void;
  onUpdateChapter: (chapter: any) => void;
  onAddChapter: (chapter: any) => void;
  thesisId: string;
}

export interface ThesisEditorMainProps {
  thesis: any | null;
  activeSection: string;
  showPreview: boolean;
  previewRef: React.RefObject<HTMLDivElement>;
  onContentChange: (id: string, content: string) => void;
  onTitleChange: (id: string, title: string) => void;
  onUpdateChapter: (chapter: any) => void;
  onAddChapter: (chapter: any) => void;
}