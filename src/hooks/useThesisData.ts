import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Thesis, ThesisContent, SectionType } from '@/types/thesis';
import { useToast } from '@/hooks/use-toast';
import { validate as validateUUID } from 'uuid';
import { useQuery, useQueryClient } from '@tanstack/react-query';

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

  // Validate metadata
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

  // Validate structure
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
      content: Array.isArray(section.content) ? section.content : [],
      figures: Array.isArray(section.figures) ? section.figures : [],
      tables: Array.isArray(section.tables) ? section.tables : [],
      citations: Array.isArray(section.citations) ? section.citations : [],
      references: Array.isArray(section.references) ? section.references : [],
      footnotes: Array.isArray(section.footnotes) ? section.footnotes : [],
    })) : [],
    chapters: Array.isArray(content?.chapters) ? content.chapters.map((chapter: any, index: number) => ({
      ...chapter,
      order: chapter.order || index + 1,
      content: Array.isArray(chapter.content) ? chapter.content : [],
      sections: Array.isArray(chapter.sections) ? chapter.sections : [],
    })) : [],
    backMatter: Array.isArray(content?.backMatter) ? content.backMatter.map((section: any) => ({
      ...section,
      type: section.type || SectionType.APPENDIX,
      required: typeof section.required === 'boolean' ? section.required : false,
      content: Array.isArray(section.content) ? section.content : [],
      figures: Array.isArray(section.figures) ? section.figures : [],
      tables: Array.isArray(section.tables) ? section.tables : [],
      citations: Array.isArray(section.citations) ? section.citations : [],
      references: Array.isArray(section.references) ? section.references : [],
      footnotes: Array.isArray(section.footnotes) ? section.footnotes : [],
    })) : [],
  };
};

export const useThesisData = (thesisId: string | undefined) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: thesis,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['thesis', thesisId],
    queryFn: async () => {
      if (!thesisId) {
        return null;
      }

      if (!validateUUID(thesisId)) {
        throw new Error('Invalid thesis ID format');
      }

      try {
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user) {
          throw new Error('Authentication required');
        }

        // First check if user has permission to access this thesis
        const { data: permission, error: permissionError } = await supabase
          .from('thesis_collaborators')
          .select('role')
          .eq('thesis_id', thesisId)
          .eq('user_id', session.session.user.id)
          .maybeSingle();

        if (permissionError) {
          throw new Error('Error checking thesis permissions');
        }

        if (!permission) {
          throw new Error('Access denied');
        }

        const { data: fetchedThesis, error: fetchError } = await supabase
          .from('theses')
          .select(`
            *,
            thesis_collaborators (
              user_id,
              role,
              profiles (
                email
              )
            )
          `)
          .eq('id', thesisId)
          .maybeSingle();

        if (fetchError) {
          throw new Error('Error fetching thesis data');
        }

        if (!fetchedThesis) {
          return null;
        }

        // Validate thesis content
        const validationErrors = validateThesisContent(fetchedThesis.content);
        if (validationErrors.length > 0) {
          toast({
            title: 'Warning',
            description: 'Some thesis data is invalid or missing. Default values will be used.',
            variant: 'warning',
          });
        }

        // Parse and structure the thesis content
        const parsedContent = parseThesisContent(fetchedThesis.content);

        const formattedThesis: Thesis = {
          id: fetchedThesis.id,
          title: fetchedThesis.title,
          content: parsedContent,
          user_id: fetchedThesis.user_id,
          created_at: fetchedThesis.created_at,
          updated_at: fetchedThesis.updated_at,
          language: fetchedThesis.language || 'en',
          status: fetchedThesis.status || 'draft',
          version: fetchedThesis.version || '1.0.0',
          permissions: {
            isPublic: fetchedThesis.is_public || false,
            allowComments: fetchedThesis.allow_comments || true,
            allowSharing: fetchedThesis.allow_sharing || false,
          },
        };

        return formattedThesis;
      } catch (err: any) {
        toast({
          title: 'Error',
          description: err.message || 'Failed to load thesis',
          variant: 'destructive',
        });
        throw err;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
    retry: 3, // Increase retries to 3
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });

  const setThesis = (newThesis: Thesis | ((prev: Thesis | null) => Thesis | null)) => {
    queryClient.setQueryData(['thesis', thesisId], newThesis);
  };

  return { thesis, setThesis, isLoading, error };
};