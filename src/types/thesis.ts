export interface Collaborator {
  id: string;
  name: string;
  email: string;
  permissions: string[];
}

export interface Thesis {
  id: string;
  title: string;
  abstract: string;
  introduction?: string;
  conclusion?: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  ownerId: string;
  collaborators?: Collaborator[];
  contentOrder?: string[];
  language?: string;
  keywords?: string[];
  visibility: 'private' | 'public';
  version?: number;
  outline?: string;
  acknowledgements?: string;
  bibliography?: string;
  tableOfContents?: string;
  notes?: string[];
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  thesisId: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Section {
  id: string;
  title: string;
  content: string;
  chapterId: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Figure {
  id: string;
  imageUrl: string;
  title: string;
  caption: string;
  altText: string;
  number: number;
  dimensions?: {
    width: number;
    height: number;
  };
  position?: 'left' | 'center' | 'right';
  customWidth?: number;
  customHeight?: number;
}

export interface Table {
  id: string;
  title: string;
  caption: string;
  content: string[][];
  thesisId: string;
  number: number;
}

export interface Citation {
  id: string;
  author: string;
  title: string;
  publisher: string;
  year: number;
  thesisId: string;
  page?: string;
  volume?: string;
  issue?: string;
  url?: string;
  accessed?: Date;
}

export interface Reference {
  id: string;
  text: string;
  thesisId: string;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: Date;
  updatedAt: Date;
  parentId?: string; // For nested comments
  context?: string; // To reference a specific part of the text
}
