export interface Section {
  id: string;
  title?: string;
  content: string;
  type: 'abstract' | 'content' | 'title';
}

export interface ThesisMetadata {
  title: string;
  authorName: string;
  thesisDate: string;
  universityName: string;
  departmentName: string;
  degree: string;
  committeeMembers?: string[];
}

export interface Thesis {
  frontMatter: Section[];
  chapters: Chapter[];
  backMatter: Section[];
  metadata: ThesisMetadata;
}

export interface Chapter {
  id: string;
  title: string;
  order: number;
  sections: Section[];
}

export interface Task {
  id: string;
  description: string;
  status: 'pending' | 'in progress' | 'completed' | 'on hold';
  priority: 'low' | 'medium' | 'high';
}

export interface Figure {
  id: string;
  imageUrl: string;
  caption: string;
  altText: string;
  title: string;
  number: number;
  dimensions: { width: number; height: number; };
  position: 'left' | 'right' | 'center';
}

export interface Reference {
  id: string;
  title: string;
  author: string;
  year: number;
  url?: string;
}
