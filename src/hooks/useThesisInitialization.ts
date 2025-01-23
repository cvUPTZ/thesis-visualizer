import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Thesis, ThesisContent, Section, SectionType } from '@/types/thesis';
import { useToast } from '@/hooks/use-toast';
import { validate as validateUUID } from 'uuid';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createEmptySection } from '@/utils/thesisUtils';

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


   const findExistingSection = (thesis: Thesis, targetId: string): Section | null => {
      // Check special sections
      if (thesis.generalIntroduction?.id === targetId) return thesis.generalIntroduction;
      if (thesis.generalConclusion?.id === targetId) return thesis.generalConclusion;

      // Check front matter
      const frontMatterSection = thesis.frontMatter?.find(s => s.id === targetId);
      if (frontMatterSection) return frontMatterSection;

      // Check back matter
      const backMatterSection = thesis.backMatter?.find(s => s.id === targetId);
      if (backMatterSection) return backMatterSection;

      // Check chapters
      for (const chapter of thesis.chapters || []) {
        const chapterSection = chapter.sections.find(s => s.id === targetId);
        if (chapterSection) return chapterSection;
      }

      return null;
    };

    const handleContentChange = async (newContent: string) => {
      if (!thesis || !section || !thesisId) return;

      try {
          console.log('Handling content change...');
          const updatedThesis = { ...thesis };
      
            // Update the appropriate section
          if (section.type === 'general_introduction') {
            updatedThesis.generalIntroduction = {
                ...updatedThesis.generalIntroduction,
                content: newContent
              };
            } else if (section.type === 'general_conclusion') {
              updatedThesis.generalConclusion = {
                ...updatedThesis.generalConclusion,
                content: newContent
              };
          } else {
            // Update in front/back matter or chapters
            const frontMatterIndex = thesis.frontMatter?.findIndex(s => s.id === section.id) ?? -1;
            if (frontMatterIndex !== -1) {
            updatedThesis.frontMatter[frontMatterIndex] = {
                ...thesis.frontMatter[frontMatterIndex],
                content: newContent
            };
            } else {
            const backMatterIndex = thesis.backMatter?.findIndex(s => s.id === section.id) ?? -1;
             if (backMatterIndex !== -1) {
                updatedThesis.backMatter[backMatterIndex] = {
                ...thesis.backMatter[backMatterIndex],
                  content: newContent
              };
            }else {
              updatedThesis.chapters = (thesis.chapters || []).map(chapter => ({
                  ...chapter,
                  sections: chapter.sections.map(s => 
                    s.id === section.id ? { ...s, content: newContent } : s
                ),
              }));
            }
          }
    
          // Ensure complete structure before saving
          const completeThesis = ensureThesisStructure(updatedThesis);

          console.log('Saving updated thesis...');
          const { error } = await supabase
              .from('theses')
            .update({ 
                content: completeThesis,
                updated_at: new Date().toISOString()
            })
            .eq('id', thesisId);
  
        if (error) throw error;
    
          setThesis(completeThesis);
          setSection({ ...section, content: newContent });
    
          toast({
            title: "Success",
            description: "Content updated successfully",
          });
        } catch (err) {
          console.error('Error updating content:', err);
          toast({
            title: "Error",
            description: "Failed to update content. Please try again.",
            variant: "destructive",
          });
        }
  };


  const handleAddSection = async (chapterId: string, sectionType: string) => {
    if (!thesis || !thesisId) return;
    try {
      const chapter = thesis.chapters.find((c) => c.id === chapterId);
      if (!chapter) return;

      console.log('Creating new section:', { chapterId, sectionType });
          const newSection: Section = createEmptySection(sectionType as SectionType);
          
          const updatedChapter = {
            ...chapter,
            sections: [...chapter.sections, newSection]
        }
        
        setThesis((prevThesis) => {
            return {
              ...prevThesis!,
              chapters: prevThesis!.chapters.map(c =>
               c.id === chapterId ? updatedChapter : c
             )
            }
          });
      toast({
        title: "Success",
        description: `Added new section`,
      });
    }
    catch (error: any) {
        console.error('Error adding section:', error);
        toast({
        title: "Error",
        description: "Failed to add new section. Please try again.",
        variant: "destructive",
    });
    }
}
  
   const findSection = async (): Promise<Section | null> => {
    if (!thesis || !sectionId || !thesisId) {
      console.log('Missing required parameters:', { hasThesis: !!thesis, sectionId, thesisId });
      return null;
    }

    // Look for existing section first by id
    const existingSection = findExistingSection(thesis, sectionId);
    if (existingSection) {
      console.log('Found existing section by ID:', existingSection);
      return existingSection;
    }
    
    // Check for general sections by their type if no ID match
    if (sectionId === 'general-introduction' && thesis.generalIntroduction) {
      console.log('Found existing general introduction by type:', thesis.generalIntroduction);
        return thesis.generalIntroduction
    }
    if (sectionId === 'general-conclusion' && thesis.generalConclusion) {
      console.log('Found existing general conclusion by type:', thesis.generalConclusion);
        return thesis.generalConclusion
    }

    // If not found, ensure thesis structure and create new section
    try {
        const completeThesis = ensureThesisStructure(thesis);
        
        // Update thesis with complete structure
        console.log('Updating thesis with complete structure...');
        const { error: updateError } = await supabase
          .from('theses')
          .update({ 
            content: completeThesis,
            updated_at: new Date().toISOString()
          })
          .eq('id', thesisId);
  
        if (updateError) {
          console.error('Error updating thesis structure:', updateError);
          throw updateError;
        }
        
       // Create new section based on its route id
       let newSectionType: string;

       if(sectionId === 'general-introduction') newSectionType = 'general_introduction'
       else if (sectionId === 'general-conclusion') newSectionType = 'general_conclusion'
       else newSectionType = 'custom';

       console.log('Creating new section type:', newSectionType);

       const { data: newSectionId, error: createError } = await supabase.rpc(
         'create_section_if_not_exists',
         { 
           p_thesis_id: thesisId,
           p_section_title: 'New Section',
           p_section_type: newSectionType
         }
       );

       if (createError) {
         console.error('Error creating new section:', createError);
         throw createError;
       }
     
      // Fetch updated thesis
      console.log('Fetching updated thesis...');
      const { data: refreshedThesis, error: refreshError } = await supabase
        .from('theses')
        .select('*')
        .eq('id', thesisId)
        .single();
  
      if (refreshError) throw refreshError;
  
      if (!refreshedThesis) {
          throw new Error('Failed to fetch updated thesis');
        }
        
      const content = typeof refreshedThesis.content === 'string' 
          ? JSON.parse(refreshedThesis.content) 
          : refreshedThesis.content;

        let newSection;
        if(sectionId === 'general-introduction' || sectionId === 'general-conclusion'){
          newSection = content[sectionId]
        }
        else{
          newSection = findExistingSection(content, newSectionId);
        }

      if (!newSection) {
          throw new Error('New section not found in updated thesis');
      }
    
      return newSection;

    } catch (err) {
      console.error('Error in section creation process:', err);
      throw new Error(`Failed to create new section: ${err.message}`);
    }
  };
  
  return { thesis, setThesis, isLoading, error, handleContentChange, handleAddSection };
};