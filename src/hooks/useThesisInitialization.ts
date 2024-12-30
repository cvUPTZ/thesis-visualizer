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
          
          // Create new thesis with the current user's ID
          const { data, error } = await supabase
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
            .maybeSingle();

          if (error) {
            console.error('Error creating thesis:', error);
            throw error;
          }

          if (!data) {
            throw new Error('Failed to create thesis');
          }

          console.log('Created new thesis:', data);

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
            throw collaboratorError;
          }
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