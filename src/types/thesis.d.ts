export type ThesisSectionType = 
  | 'title'
  | 'table-of-contents'
  | 'list-of-figures'
  | 'list-of-tables'
  | 'acknowledgments'
  | 'abstract'
  | 'list-of-abbreviations'
  | 'general-introduction'
  | 'introduction'
  | 'methodology'
  | 'results'
  | 'discussion'
  | 'conclusion'
  | 'bibliography'
  | 'appendix'
  | 'custom'
  | 'references'
  | 'chapter'
  | 'research-questions'
  | 'hypotheses'
  | 'objectives'
  | 'problem-statement'
  | 'thesis-structure'
  | 'statistical-tests'
  | 'general-context'
  | 'general-conclusion'
  | 'statement'
  | 'preface';

export interface Comment {
  id: string;
  content: string;
  reviewer_id: string;
  created_at: string;
}