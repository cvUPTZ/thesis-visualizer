import { Section, Thesis } from '@/types/thesis';

export type SectionType = 'general-introduction' | 'general-conclusion';

export const createEmptySection = (type: SectionType): Section => ({
  id: type,
  title: type === 'general-introduction' ? 'General Introduction' : 'General Conclusion',
  content: '',
  type,
  required: true,
  order: 1,
  status: 'draft',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  figures: [],
  tables: [],
  citations: [],
  references: []
});

export const ensureThesisStructure = (thesis: Partial<Thesis>): Thesis => ({
  ...thesis,
  metadata: thesis.metadata || {},
  frontMatter: thesis.frontMatter || [],
  generalIntroduction: thesis.generalIntroduction || createEmptySection('general-introduction'),
  chapters: thesis.chapters || [],
  generalConclusion: thesis.generalConclusion || createEmptySection('general-conclusion'),
  backMatter: thesis.backMatter || []
});
