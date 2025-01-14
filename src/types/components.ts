import { Section, Reference, Citation, Task, Chapter } from './thesis';

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

export interface CitationProps {
  citation: Citation;
  onUpdate: (citation: Citation) => void;
  onDelete: (id: string) => void;
}

export interface ReferenceManagerProps {
  items: Reference[];
  onAdd: (reference: Reference) => void;
  onRemove: (id: string) => void;
  onUpdate: (reference: Reference) => void;
}

export interface ReferenceProps {
  reference: Reference;
  onUpdate: (reference: Reference) => void;
  onDelete: (id: string) => void;
}

export interface SectionContentProps {
  section: Section;
  isActive: boolean;
  onContentChange: (content: string) => void;
  onUpdateSectionData: (section: Section) => void;
}

export interface TaskItemProps {
  id: string;
  description: string;
  status: Task['status'];
  priority: Task['priority'];
  onToggleStatus: (status: Task['status']) => void;
  onChangeDescription: (description: string) => void;
}

export interface ThesisContentProps {
  frontMatter: Section[];
  chapters: Chapter[];
  backMatter: Section[];
  activeSection: string;
  onContentChange: (id: string, content: string) => void;
  onTitleChange: (id: string, title: string) => void;
  thesisId: string;
  onUpdateChapter: (chapter: Chapter) => void;
  onAddChapter: (chapter: Chapter) => void;
}

export interface ThesisEditorContentProps extends ThesisContentProps {}

export interface ThesisSidebarProps {
  sections: Section[];
  activeSection: string;
  onSectionSelect: (id: string) => void;
  thesisId: string;
  onUpdateSectionData: (section: Section) => void;
  onAddSectionTask: (sectionId: string) => void;
  onUpdateSectionTask: (sectionId: string, taskId: string, status: Task['status']) => void;
  onChangeSectionTaskDescription: (sectionId: string, taskId: string, description: string) => void;
}