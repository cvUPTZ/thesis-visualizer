import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Thesis } from '@/types/thesis';
import { Json } from '@/integrations/supabase/types';

export const useThesisInitialization = (thesis: Thesis | null) => {
  const { toast } = useToast();

  useEffect(() => {
    const initializeThesis = async () => {
      // Only proceed if thesis is not null
      if (!thesis) {
        return;
      }

      try {
        console.log('Initializing thesis in database:', thesis.id);
        
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('Error getting current user:', userError);
          throw userError;
        }

        if (!user) {
          throw new Error('No authenticated user found');
        }

        console.log('Current user:', user.id);

        // First get user profile to ensure it exists
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          throw profileError;
        }

        console.log('User profile:', profile);

        // Check if thesis already exists
        const { data: existingThesis, error: checkError } = await supabase
          .from('theses')
          .select('*')
          .eq('id', thesis.id)
          .maybeSingle();

        if (checkError) {
          console.error('Error checking thesis:', checkError);
          throw checkError;
        }

        if (!existingThesis) {
          console.log('Creating new thesis with user_id:', user.id);
          
          // Create the thesis with the content
          const thesisContent = {
            frontMatter: thesis.frontMatter.map(section => ({
              ...section,
              figures: section.figures || [],
              tables: section.tables || [],
              citations: section.citations || [],
              references: section.references || []
            })),
            chapters: thesis.chapters.map(chapter => ({
              ...chapter,
              sections: chapter.sections.map(section => ({
                ...section,
                figures: section.figures || [],
                tables: section.tables || [],
                citations: section.citations || [],
                references: section.references || []
              }))
            })),
            backMatter: thesis.backMatter.map(section => ({
              ...section,
              figures: section.figures || [],
              tables: section.tables || [],
              citations: section.citations || [],
              references: section.references || []
            }))
          } as unknown as Json;

          // Insert thesis
          const { error: thesisError } = await supabase
            .from('theses')
            .insert({
              id: thesis.id,
              title: 'Untitled Thesis',
              content: thesisContent,
              user_id: user.id
            });

          if (thesisError) {
            console.error('Error creating thesis:', thesisError);
            throw thesisError;
          }

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
              .delete()
              .eq('id', thesis.id);
            throw collaboratorError;
          }

          console.log('Added user as thesis owner');
        }
      } catch (error: any) {
        console.error('Error in thesis initialization:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to initialize thesis. Please try again.",
          variant: "destructive",
        });
      }
    };

    initializeThesis();
  }, [thesis?.id, toast]);
};