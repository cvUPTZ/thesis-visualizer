import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Thesis } from '@/types/thesis';

export const useThesisInitialization = (thesis: Thesis) => {
  const { toast } = useToast();

  useEffect(() => {
    const initializeThesis = async () => {
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
          .single();

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
          .single();

        if (checkError && checkError.code !== 'PGRST116') {
          console.error('Error checking thesis:', checkError);
          throw checkError;
        }

        if (!existingThesis) {
          console.log('Creating new thesis with user_id:', user.id);
          
          // First create the thesis
          const { data: newThesis, error: thesisError } = await supabase
            .from('theses')
            .insert({
              id: thesis.id,
              title: 'Untitled Thesis',
              content: JSON.stringify({
                frontMatter: thesis.frontMatter,
                chapters: thesis.chapters,
                backMatter: thesis.backMatter
              }),
              user_id: user.id
            })
            .select()
            .single();

          if (thesisError) {
            console.error('Error creating thesis:', thesisError);
            throw thesisError;
          }

          console.log('Created new thesis:', newThesis);

          // Then add current user as owner
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
  }, [thesis.id, toast]);
};