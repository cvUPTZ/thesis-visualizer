export interface Thesis {
  id: string;
  metadata: {
    description: string;
    keywords: string[];
    createdAt: string;
    universityName?: string;
    departmentName?: string;
    authorName?: string;
    thesisDate?: string;
    committeeMembers?: string[];
  };
  frontMatter: Section[];
  chapters: Chapter[];
  backMatter: Section[];
}

export interface Chapter {
  id: string;
  title: string;
  order: number;
  sections: Section[];
}

export interface Section {
  id: string;
  title: string;
  content: string;
  type: ThesisSectionType;
  order: number;
  figures: Figure[];
  tables: Table[];
  citations: Citation[];
  references?: Reference[];
}

export interface Table {
  id: string;
  caption?: string;
  content: string;
  title?: string;
}

export interface Figure {
  id: string;
  caption?: string;
  content: string;
}

export interface Citation {
  id: string;
  content: string;
}

export interface Reference {
  id: string;
  content: string;
}

export type ThesisSectionType = 'custom' | 'references';
