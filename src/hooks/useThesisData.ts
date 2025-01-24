import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Thesis, ThesisContent, Section } from '@/types/thesis';
import { useToast } from '@/hooks/use-toast';
import { validate as validateUUID } from 'uuid';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ensureThesisStructure } from '@/utils/thesisUtils';

export const useThesisData = (thesisId: string | undefined) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [section, setSection] = useState<Section | null>(null);

  const { data: thesis, isLoading, error } = useQuery({
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
          throw new Error('Authentication required');
        }

        // Permission check
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

        // Parse and ensure thesis structure
        const parsedContent = typeof fetchedThesis.content === 'string' 
          ? JSON.parse(fetchedThesis.content) 
          : fetchedThesis.content;

        return ensureThesisStructure({
          ...fetchedThesis,
          content: {
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
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const findExistingSection = (targetId: string): Section | null => {
    if (!thesis) return null;

    if (thesis.generalIntroduction?.id === targetId) return thesis.generalIntroduction;
    if (thesis.generalConclusion?.id === targetId) return thesis.generalConclusion;

    const frontMatterSection = thesis.frontMatter?.find(s => s.id === targetId);
    if (frontMatterSection) return frontMatterSection;

    const backMatterSection = thesis.backMatter?.find(s => s.id === targetId);
    if (backMatterSection) return backMatterSection;

    for (const chapter of thesis.chapters || []) {
      const chapterSection = chapter.sections.find(s => s.id === targetId);
      if (chapterSection) return chapterSection;
    }

    return null;
  };

  const handleContentChange = async (newContent: string) => {
    if (!thesis || !section || !thesisId) return;

    try {
      const updatedThesis = { ...thesis };
      
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
      }

      const completeThesis = ensureThesisStructure(updatedThesis);
      const { error } = await supabase
        .from('theses')
        .update({ 
          content: completeThesis,
          updated_at: new Date().toISOString()
        })
        .eq('id', thesisId);

      if (error) throw error;

      queryClient.setQueryData(['thesis', thesisId], completeThesis);
      setSection(prev => prev ? { ...prev, content: newContent } : null);

      toast({
        title: "Success",
        description: "Content updated successfully",
      });
    } catch (err: any) {
      console.error('Error updating content:', err);
      toast({
        title: "Error",
        description: err.message || "Failed to update content. Please try again.",
        variant: "destructive",
      });
    }
  };

  return { 
    thesis, 
    isLoading, 
    error, 
    handleContentChange, 
    findExistingSection, 
    section, 
    setSection 
  };
};