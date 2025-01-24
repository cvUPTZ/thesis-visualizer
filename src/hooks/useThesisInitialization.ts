import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Thesis, ThesisContent, Section, SectionType } from '@/types/thesis';
import { useToast } from '@/hooks/use-toast';
import { validate as validateUUID } from 'uuid';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createEmptySection, ensureThesisStructure } from '@/utils/thesisUtils';

interface ValidationError {
  field: string;
  message: string;
}

const validateThesisContent = (content: any): ValidationError[] => {
  const errors: ValidationError[] = [];
  if (!content) {
    errors.push({ field: 'content', message: 'Thesis content is required' });
    return errors;
  }
  if (!content.metadata) {
    errors.push({ field: 'metadata', message: 'Thesis metadata is required' });
  } else {
    if (!content.metadata.authors?.length) {
      errors.push({ field: 'metadata.authors', message: 'At least one author is required' });
    }
    if (!content.metadata.universityName) {
      errors.push({ field: 'metadata.universityName', message: 'University name is required' });
    }
    if (!content.metadata.departmentName) {
      errors.push({ field: 'metadata.departmentName', message: 'Department name is required' });
    }
  }
  if (!Array.isArray(content.frontMatter)) {
    errors.push({ field: 'frontMatter', message: 'Front matter must be an array' });
  }
  if (!Array.isArray(content.chapters)) {
    errors.push({ field: 'chapters', message: 'Chapters must be an array' });
  }
  if (!Array.isArray(content.backMatter)) {
    errors.push({ field: 'backMatter', message: 'Back matter must be an array' });
  }
  return errors;
};

const parseThesisContent = (rawContent: any): ThesisContent => {
  const content = typeof rawContent === 'string' ? JSON.parse(rawContent) : rawContent;
  return {
    metadata: {
      description: content?.metadata?.description || '',
      keywords: Array.isArray(content?.metadata?.keywords) ? content.metadata.keywords : [],
      createdAt: content?.metadata?.createdAt || new Date().toISOString(),
      universityName: content?.metadata?.universityName || '',
      departmentName: content?.metadata?.departmentName || '',
      authors: Array.isArray(content?.metadata?.authors) ? content.metadata.authors : [],
      supervisors: Array.isArray(content?.metadata?.supervisors) ? content.metadata.supervisors : [],
      committeeMembers: Array.isArray(content?.metadata?.committeeMembers) ? content.metadata.committeeMembers : [],
      thesisDate: content?.metadata?.thesisDate || '',
      language: content?.metadata?.language || 'en',
      version: content?.metadata?.version || '1.0.0',
    },
    frontMatter: Array.isArray(content?.frontMatter) ? content.frontMatter.map((section: any) => ({
      ...section,
      type: section.type || SectionType.ABSTRACT,
      required: typeof section.required === 'boolean' ? section.required : true,
      content: Array.isArray(section.content) ? section.content : '',
      figures: Array.isArray(section.figures) ? section.figures : [],
      tables: Array.isArray(section.tables) ? section.tables : [],
      citations: Array.isArray(section.citations) ? section.citations : [],
      references: Array.isArray(section.references) ? section.references : [],
      footnotes: Array.isArray(section.footnotes) ? section.footnotes : [],
    })) : [],
    chapters: Array.isArray(content?.chapters) ? content.chapters.map((chapter: any, index: number) => ({
      ...chapter,
      order: chapter.order || index + 1,
      content: Array.isArray(chapter.content) ? chapter.content : '',
      sections: Array.isArray(chapter.sections) ? chapter.sections : [],
    })) : [],
    backMatter: Array.isArray(content?.backMatter) ? content.backMatter.map((section: any) => ({
      ...section,
      type: section.type || SectionType.APPENDIX,
      required: typeof section.required === 'boolean' ? section.required : false,
      content: Array.isArray(section.content) ? section.content : '',
      figures: Array.isArray(section.figures) ? section.figures : [],
      tables: Array.isArray(section.tables) ? section.tables : [],
      citations: Array.isArray(section.citations) ? section.citations : [],
      references: Array.isArray(section.references) ? section.references : [],
      footnotes: Array.isArray(section.footnotes) ? section.footnotes : [],
    })) : [],
  };
};

export const useThesisInitialization = (thesisId: string | undefined) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [section, setSection] = useState<Section | null>(null);

  const { data: thesis, isLoading, error } = useQuery({
    queryKey: ['thesis', thesisId],
    queryFn: async () => {
      if (!thesisId) return null;
      if (!validateUUID(thesisId)) throw new Error('Invalid thesis ID format');

      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user) throw new Error('Authentication required');

        // Check permissions
        const { data: permission, error: permissionError } = await supabase
          .from('thesis_collaborators')
          .select('role')
          .eq('thesis_id', thesisId)
          .eq('user_id', session.session.user.id)
          .maybeSingle();

        if (permissionError) throw permissionError;
        if (!permission) throw new Error('Access denied');

        // Fetch thesis data
        const { data: fetchedThesis, error: fetchError } = await supabase
          .from('theses')
          .select('*')
          .eq('id', thesisId)
          .single();

        if (fetchError) throw fetchError;
        if (!fetchedThesis) throw new Error('Thesis not found');

        // Parse and validate content
        const parsedContent = parseThesisContent(fetchedThesis.content);
        const validationErrors = validateThesisContent(parsedContent);
        
        if (validationErrors.length > 0) {
          throw new Error(validationErrors.map(e => `${e.field}: ${e.message}`).join('\n'));
        }

        return ensureThesisStructure({
          ...fetchedThesis,
          content: parsedContent
        });
      } catch (err: any) {
        toast({
          title: 'Error',
          description: err.message || 'Failed to load thesis',
          variant: 'destructive',
        });
        throw err;
      }
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
  });

  const findExistingSection = (targetId: string): Section | null => {
    if (!thesis) return null;
    if (thesis.content.generalIntroduction?.id === targetId) return thesis.content.generalIntroduction;
    if (thesis.content.generalConclusion?.id === targetId) return thesis.content.generalConclusion;

    const frontMatterSection = thesis.content.frontMatter?.find(s => s.id === targetId);
    if (frontMatterSection) return frontMatterSection;

    const backMatterSection = thesis.content.backMatter?.find(s => s.id === targetId);
    if (backMatterSection) return backMatterSection;

    for (const chapter of thesis.content.chapters || []) {
      const chapterSection = chapter.sections.find(s => s.id === targetId);
      if (chapterSection) return chapterSection;
    }

    return null;
  };

  const handleContentChange = async (newContent: string) => {
    if (!thesis || !section || !thesisId) return;

    try {
      const updatedThesis = { ...thesis };
      const contentPath = [];

      if (section.type === SectionType.GENERAL_INTRODUCTION) {
        updatedThesis.content.generalIntroduction.content = newContent;
        contentPath.push('generalIntroduction');
      } else if (section.type === SectionType.GENERAL_CONCLUSION) {
        updatedThesis.content.generalConclusion.content = newContent;
        contentPath.push('generalConclusion');
      } else {
        // Update specific section content
        const frontIndex = updatedThesis.content.frontMatter.findIndex(s => s.id === section.id);
        if (frontIndex !== -1) {
          updatedThesis.content.frontMatter[frontIndex].content = newContent;
          contentPath.push('frontMatter', frontIndex.toString());
        } else {
          const backIndex = updatedThesis.content.backMatter.findIndex(s => s.id === section.id);
          if (backIndex !== -1) {
            updatedThesis.content.backMatter[backIndex].content = newContent;
            contentPath.push('backMatter', backIndex.toString());
          } else {
            updatedThesis.content.chapters.forEach((chapter, chapterIndex) => {
              const sectionIndex = chapter.sections.findIndex(s => s.id === section.id);
              if (sectionIndex !== -1) {
                updatedThesis.content.chapters[chapterIndex].sections[sectionIndex].content = newContent;
                contentPath.push('chapters', chapterIndex.toString(), 'sections', sectionIndex.toString());
              }
            });
          }
        }
      }

      const { error } = await supabase
        .from('theses')
        .update({
          content: updatedThesis.content,
          updated_at: new Date().toISOString()
        })
        .eq('id', thesisId);

      if (error) throw error;

      queryClient.setQueryData(['thesis', thesisId], updatedThesis);
      setSection(prev => prev ? { ...prev, content: newContent } : null);

      toast({
        title: "Content Updated",
        description: "Changes saved successfully",
      });
    } catch (err: any) {
      console.error('Update error:', err);
      toast({
        title: "Update Failed",
        description: err.message || "Failed to save changes",
        variant: "destructive",
      });
    }
  };

  const handleAddSection = async (parentId: string, sectionType: SectionType) => {
    if (!thesis || !thesisId) return;

    try {
      const newSection = createEmptySection(sectionType);
      const updatedThesis = { ...thesis };

      if (sectionType === SectionType.CHAPTER) {
        updatedThesis.content.chapters.push({
          ...newSection,
          sections: []
        });
      } else {
        const parentChapter = updatedThesis.content.chapters.find(c => c.id === parentId);
        if (parentChapter) {
          parentChapter.sections.push(newSection);
        } else if (sectionType === SectionType.ABSTRACT) {
          updatedThesis.content.frontMatter.push(newSection);
        } else {
          updatedThesis.content.backMatter.push(newSection);
        }
      }

      const { error } = await supabase
        .from('theses')
        .update({
          content: updatedThesis.content,
          updated_at: new Date().toISOString()
        })
        .eq('id', thesisId);

      if (error) throw error;

      queryClient.setQueryData(['thesis', thesisId], updatedThesis);
      toast({
        title: "Section Added",
        description: `New ${sectionType.toLowerCase()} section created`,
      });
    } catch (err: any) {
      console.error('Add section error:', err);
      toast({
        title: "Add Failed",
        description: err.message || "Failed to create new section",
        variant: "destructive",
      });
    }
  };

  return {
    thesis,
    isLoading,
    error,
    section,
    setSection,
    findExistingSection,
    handleContentChange,
    handleAddSection
  };
};