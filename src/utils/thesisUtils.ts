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

export const ensureThesisStructure = (thesis: Partial<Thesis>): Thesis => {
  const now = new Date().toISOString();
  
  // Create base structure
  const baseStructure = {
    id: thesis.id || crypto.randomUUID(),
    title: thesis.title || 'Untitled Thesis',
    content: {
      metadata: {
        description: '',
        keywords: [],
        createdAt: now,
        universityName: '',
        departmentName: '',
        authors: [],
        supervisors: [],
        committeeMembers: [],
        thesisDate: '',
        language: 'en',
        version: '1.0'
      },
      frontMatter: [],
      generalIntroduction: createEmptySection(SectionType.GENERAL_INTRODUCTION),
      chapters: [],
      generalConclusion: createEmptySection(SectionType.GENERAL_CONCLUSION),
      backMatter: []
    },
    user_id: thesis.user_id || '',
    language: thesis.language || 'en',
    status: thesis.status || 'draft',
    version: thesis.version || '1.0',
    permissions: thesis.permissions || {
      isPublic: false,
      allowComments: true,
      allowSharing: false
    },
    created_at: thesis.created_at || now,
    updated_at: thesis.updated_at || now
  };

  // Merge with existing content if available
  if (thesis.content) {
    baseStructure.content = {
      ...baseStructure.content,
      metadata: { ...baseStructure.content.metadata, ...thesis.content.metadata },
      frontMatter: Array.isArray(thesis.content.frontMatter) ? thesis.content.frontMatter : [],
      generalIntroduction: thesis.content.generalIntroduction || baseStructure.content.generalIntroduction,
      chapters: Array.isArray(thesis.content.chapters) ? thesis.content.chapters : [],
      generalConclusion: thesis.content.generalConclusion || baseStructure.content.generalConclusion,
      backMatter: Array.isArray(thesis.content.backMatter) ? thesis.content.backMatter : []
    };
  }

  return baseStructure as Thesis;
};