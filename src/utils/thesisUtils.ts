import { Section, Thesis } from '@/types/thesis';

export type SectionType = 'general-introduction' | 'general-conclusion' | 'abstract' | 'acknowledgments' | 'chapter' | 'references' | 'appendix';

export const createEmptySection = (type: SectionType, order: number = 1): Section => ({
  id: crypto.randomUUID(),
  title: type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
  content: '',
  type,
  required: type === 'general-introduction' || type === 'general-conclusion',
  order,
  status: 'draft',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  figures: [],
  tables: [],
  citations: [],
  references: [],
  footnotes: []
});

export const ensureThesisStructure = (thesis: Partial<Thesis>): Thesis => ({
  ...thesis,
  id: thesis.id || crypto.randomUUID(),
  title: thesis.title || 'Untitled Thesis',
  metadata: thesis.metadata || {},
  frontMatter: thesis.frontMatter || [],
  generalIntroduction: thesis.generalIntroduction || createEmptySection('general-introduction'),
  chapters: thesis.chapters || [],
  generalConclusion: thesis.generalConclusion || createEmptySection('general-conclusion'),
  backMatter: thesis.backMatter || []
});
