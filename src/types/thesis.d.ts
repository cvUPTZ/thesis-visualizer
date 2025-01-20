export interface Thesis {
  id: string;
  title: string;
  generalIntroduction?: Section;
  generalConclusion?: Section;
  frontMatter: Section[];
  chapters: Chapter[];
  backMatter: Section[];
}

export interface Chapter {
  id: string;
  title: string;
  sections: Section[];
  thesis_id: string;
}

export interface Section {
  id: string;
  title: string;
  content: string;
  footnotes?: Footnote[];
}

export interface Footnote {
  id: string;
  text: string;
}

export interface CommentThread {
  id: string;
  comments: Comment[];
  section_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  created_at: string;
}
