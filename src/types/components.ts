import { Citation, Reference, Figure, Table } from './thesis';

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
  section: {
    id: string;
    title: string;
    content: string;
    type?: string;
    order?: number;
    figures?: Figure[];
    tables?: Table[];
    citations?: Citation[];
    required?: boolean;
    references?: Reference[];
  };
  isActive: boolean;
  onContentChange: (id: string, content: string) => void;
  onTitleChange: (id: string, title: string) => void;
}

export interface ThesisProps {
  thesis: {
    id: string;
    title: string;
    content: any;
  };
  activeSection: string;
  onSectionSelect: (id: string) => void;
}

export interface ThesisEditorProps {
  thesisId?: string;
}

export interface ThesisPreviewProps {
  thesis: {
    id: string;
    title: string;
    content: any;
  };
  language?: 'en' | 'fr';
}

export interface ThesisSidebarProps {
  sections: Array<{
    id: string;
    title: string;
    content: string;
  }>;
  activeSection: string;
  onSectionSelect: (id: string) => void;
}

export interface ThesisContentProps {
  frontMatter: Array<{
    id: string;
    title: string;
    content: string;
  }>;
  chapters: Array<{
    id: string;
    title: string;
    content: string;
  }>;
  backMatter: Array<{
    id: string;
    title: string;
    content: string;
  }>;
  activeSection: string;
  onContentChange: (id: string, content: string) => void;
  onTitleChange: (id: string, title: string) => void;
  onUpdateChapter: (chapter: any) => void;
  onAddChapter: (chapter: any) => void;
  thesisId: string;
}

export interface ThesisEditorMainProps {
  thesis: {
    id: string;
    title: string;
    content: any;
  } | null;
  activeSection: string;
  showPreview: boolean;
  previewRef: React.RefObject<HTMLDivElement>;
  onContentChange: (id: string, content: string) => void;
  onTitleChange: (id: string, title: string) => void;
  onUpdateChapter: (chapter: any) => void;
  onAddChapter: (chapter: any) => void;
}

export interface SectionManagerProps {
  section: Section;
  onUpdate: (section: Section) => void;
}

export interface AbstractSectionManagerProps extends SectionManagerProps {}
export interface IntroductionSectionManagerProps extends SectionManagerProps {}
export interface ConclusionSectionManagerProps extends SectionManagerProps {}
export interface ReferenceSectionManagerProps extends SectionManagerProps {}
