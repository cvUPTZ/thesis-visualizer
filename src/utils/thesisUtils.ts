import { Section, Thesis, SectionType } from '@/types/thesis';

export const createEmptySection = (type: SectionType, order: number = 1): Section => ({
  id: crypto.randomUUID(),
  title: type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
  content: '',
  type,
  required: type === SectionType.GENERAL_INTRODUCTION || type === SectionType.GENERAL_CONCLUSION,
  order,
  figures: [],
  tables: [],
  citations: [],
  references: [],
  footnotes: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
});

export const ensureThesisStructure = (thesis: Partial<Thesis>): Thesis => ({
  ...thesis,
  id: thesis.id || crypto.randomUUID(),
  title: thesis.title || 'Untitled Thesis',
  content: {
    metadata: thesis.content?.metadata || {
      description: '',
      keywords: [],
      createdAt: new Date().toISOString(),
      universityName: '',
      departmentName: '',
      authors: [],
      supervisors: [],
      committeeMembers: [],
      thesisDate: '',
      language: 'en',
      version: '1.0'
    },
    frontMatter: thesis.content?.frontMatter || [],
    generalIntroduction: thesis.content?.generalIntroduction || createEmptySection(SectionType.GENERAL_INTRODUCTION),
    chapters: thesis.content?.chapters || [],
    generalConclusion: thesis.content?.generalConclusion || createEmptySection(SectionType.GENERAL_CONCLUSION),
    backMatter: thesis.content?.backMatter || []
  },
  metadata: thesis.metadata || {
    description: '',
    keywords: [],
    createdAt: new Date().toISOString(),
    universityName: '',
    departmentName: '',
    authors: [],
    supervisors: [],
    committeeMembers: [],
    thesisDate: '',
    language: 'en',
    version: '1.0'
  },
  frontMatter: thesis.frontMatter || [],
  chapters: thesis.chapters || [],
  backMatter: thesis.backMatter || [],
  user_id: thesis.user_id || '',
  language: thesis.language || 'en',
  status: thesis.status || 'draft',
  version: thesis.version || '1.0',
  permissions: thesis.permissions || {
    isPublic: false,
    allowComments: true,
    allowSharing: false
  },
  created_at: thesis.created_at || new Date().toISOString(),
  updated_at: thesis.updated_at || new Date().toISOString()
});