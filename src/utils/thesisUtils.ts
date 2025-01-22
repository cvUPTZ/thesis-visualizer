import { Section, Thesis } from '@/types/thesis';

export type SectionType = 'general-introduction' | 'general-conclusion';

export const createEmptySection = (type: SectionType): Section => ({
  id: type,
  title: type === 'general-introduction' ? 'General Introduction' : 'General Conclusion',
  content: '',
  type: type === 'general-introduction' ? 'general-introduction' : 'general-conclusion',
  required: true,
  order: 1,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  figures: [],
  tables: [],
  citations: [],
  references: []
});

export const ensureThesisStructure = (thesis: Partial<Thesis>): Thesis => {
  const content = {
    metadata: thesis.content?.metadata || {},
    frontMatter: thesis.content?.frontMatter || [],
    generalIntroduction: thesis.content?.generalIntroduction || createEmptySection('general-introduction'),
    chapters: thesis.content?.chapters || [],
    generalConclusion: thesis.content?.generalConclusion || createEmptySection('general-conclusion'),
    backMatter: thesis.content?.backMatter || []
  };

  return {
    ...thesis,
    id: thesis.id || crypto.randomUUID(),
    title: thesis.title || '',
    content,
    metadata: content.metadata,
    frontMatter: content.frontMatter,
    generalIntroduction: content.generalIntroduction,
    chapters: content.chapters,
    generalConclusion: content.generalConclusion,
    backMatter: content.backMatter,
    user_id: thesis.user_id || '',
    language: thesis.language || 'en',
    status: thesis.status || 'draft',
    version: thesis.version || '1.0.0',
    permissions: thesis.permissions || {
      isPublic: false,
      allowComments: true,
      allowSharing: false
    },
    created_at: thesis.created_at || new Date().toISOString(),
    updated_at: thesis.updated_at || new Date().toISOString()
  } as Thesis;
};