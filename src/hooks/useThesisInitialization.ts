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

  useEffect(() => {
    const initializeThesis = async () => {
      if (!thesis) {
        console.log('No thesis provided for initialization');
        return;
      }

      try {
        console.log('Starting thesis initialization:', thesis.id);
        
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('Error getting current user:', userError);
          throw userError;
        }

        if (!user) {
          throw new Error('No authenticated user found');
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (permissionError) {
          throw new Error('Error checking thesis permissions');
        }

        if (!permission) {
          throw new Error('Access denied');
        }

        const { data: existingThesis, error: checkError } = await supabase
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

        if (checkError) {
          console.error('Error checking thesis:', checkError);
          throw checkError;
        }

        if (!existingThesis) {
          console.log('Creating new thesis with user_id:', user.id);
          
          const now = new Date().toISOString();
          
          // Create complete thesis content structure with all required fields
          const thesisContent = {
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
            generalIntroduction: {
              id: crypto.randomUUID(),
              title: 'General Introduction',
              content: '',
              type: 'general_introduction',
              required: true,
              order: 1,
              figures: [],
              tables: [],
              citations: [],
              references: [],
              created_at: now,
              updated_at: now
            },
            chapters: [],
            generalConclusion: {
              id: crypto.randomUUID(),
              title: 'General Conclusion',
              content: '',
              type: 'general_conclusion',
              required: true,
              order: 1,
              figures: [],
              tables: [],
              citations: [],
              references: [],
              created_at: now,
              updated_at: now
            },
            backMatter: []
          } as unknown as Json;

          // Insert thesis with complete content structure
          const { error: thesisError } = await supabase
            .from('theses')
            .insert({
              id: thesis.id,
              title: thesis.title || 'Untitled Thesis',
              content: thesisContent,
              user_id: user.id,
              created_at: now,
              updated_at: now,
              language: 'en',
              status: 'draft',
              version: '1.0',
              permissions: {
                isPublic: false,
                allowComments: true,
                allowSharing: false
              }
            });

          if (thesisError) {
            console.error('Error creating thesis:', thesisError);
            throw thesisError;
          }

          console.log('Created new thesis with content:', thesisContent);

          // Add current user as owner
          const { error: collaboratorError } = await supabase
            .from('thesis_collaborators')
            .insert({
              thesis_id: thesis.id,
              user_id: user.id,
              role: 'owner'
            });

          if (collaboratorError) {
            console.error('Error adding thesis owner:', collaboratorError);
            // If we fail to add collaborator, delete the thesis
            await supabase
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