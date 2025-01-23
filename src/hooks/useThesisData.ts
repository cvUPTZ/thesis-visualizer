import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Thesis, ThesisContent } from '@/types/thesis';
import { useToast } from '@/hooks/use-toast';
import { validate as validateUUID } from 'uuid';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ensureThesisStructure } from '@/utils/thesisUtils';

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
        console.log('No thesis ID provided');
        return null;
      }

      if (!validateUUID(thesisId)) {
        console.error('Invalid thesis ID format:', thesisId);
        throw new Error('Invalid thesis ID format');
      }

      try {
        console.log('Fetching thesis data for ID:', thesisId);
        const { data: session } = await supabase.auth.getSession();
        if (!session?.session?.user) {
          console.error('No authenticated user found');
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
          console.error('Error checking thesis permissions:', permissionError);
          throw new Error('Error checking thesis permissions');
        }

        if (!permission) {
          console.error('User does not have permission to access this thesis');
          throw new Error('Access denied');
        }

        // Fetch thesis with complete structure
        const { data: fetchedThesis, error: fetchError } = await supabase
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
          } else {
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
          console.error('Error fetching thesis data:', fetchError);
          throw new Error('Error fetching thesis data');
        }

        if (!fetchedThesis) {
          console.error('Thesis not found:', thesisId);
          return null;
        }

        // Parse content if it's a string
        const parsedContent = typeof fetchedThesis.content === 'string' 
          ? JSON.parse(fetchedThesis.content) 
          : fetchedThesis.content;

        // Ensure thesis has complete structure before returning
        const completeThesis = ensureThesisStructure({
          ...fetchedThesis,
          content: {
            ...parsedContent,
            metadata: parsedContent.metadata || {
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
            frontMatter: parsedContent.frontMatter || [],
            generalIntroduction: parsedContent.generalIntroduction || {
              id: crypto.randomUUID(),
              title: 'General Introduction',
              content: '',
              type: 'general_introduction',
              required: true,
              order: 1,
              figures: [],
              tables: [],
              citations: [],
              references: []
            },
            chapters: parsedContent.chapters || [],
            generalConclusion: parsedContent.generalConclusion || {
              id: crypto.randomUUID(),
              title: 'General Conclusion',
              content: '',
              type: 'general_conclusion',
              required: true,
              order: 1,
              figures: [],
              tables: [],
              citations: [],
              references: []
            },
            backMatter: parsedContent.backMatter || []
          }
        });

        console.log('Fetched and structured thesis:', completeThesis);
        return completeThesis;

      } catch (err: any) {
        console.error('Error in thesis data fetch:', err);
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
          title: 'Error',
          description: err.message || 'Failed to load thesis',
          variant: 'destructive',
        });
        throw err;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const setThesis = (newThesis: Thesis | ((prev: Thesis | null) => Thesis | null)) => {
    const updatedThesis = typeof newThesis === 'function' 
      ? newThesis(thesis)
      : newThesis;

    if (updatedThesis) {
      // Ensure the thesis structure is complete before updating
      const completeThesis = ensureThesisStructure(updatedThesis);
      queryClient.setQueryData(['thesis', thesisId], completeThesis);
    } else {
      queryClient.setQueryData(['thesis', thesisId], null);
    }
  };

  return { thesis, setThesis, isLoading, error };
          title: "Error",
          description: "Failed to update content. Please try again.",
          variant: "destructive",
        });
      }
};