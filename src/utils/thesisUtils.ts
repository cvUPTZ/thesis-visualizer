import { Section, Thesis, SectionType } from '@/types/thesis';

<<<<<<< HEAD
export type SectionType = 'general-introduction' | 'general-conclusion' | 'abstract' | 'acknowledgments' | 'chapter' | 'references' | 'appendix';

export const createEmptySection = (type: SectionType, order: number = 1): Section => ({
  id: type === 'general-introduction' || type === 'general-conclusion' ? type : crypto.randomUUID(),
  title: type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
  content: '',
  type,
  required: type === 'general-introduction' || type === 'general-conclusion',
  order,
  status: 'draft',
=======
export type GeneralSectionType = 'general-introduction' | 'general-conclusion';

export const createEmptySection = (type: GeneralSectionType): Section => ({
  id: type,
  title: type === 'general-introduction' ? 'General Introduction' : 'General Conclusion',
  content: '',
  type: type === 'general-introduction' ? SectionType.GENERAL_INTRODUCTION : SectionType.GENERAL_CONCLUSION,
  required: true,
  order: 1,
>>>>>>> dcfca8b0c9d27709c346d99b30b4058f47f790c4
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  figures: [],
  tables: [],
  citations: [],
  references: [],
  footnotes: []
});

<<<<<<< HEAD
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
=======
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
>>>>>>> dcfca8b0c9d27709c346d99b30b4058f47f790c4
