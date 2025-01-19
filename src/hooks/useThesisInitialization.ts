import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Thesis } from '@/types/thesis';
import { Json } from '@/integrations/supabase/types';
import { v4 as uuidv4 } from 'uuid';

export const useThesisInitialization = (thesis: Thesis | null) => {
  const { toast } = useToast();

  useEffect(() => {
    const initializeThesis = async () => {
      if (!thesis) return;

      try {
        console.log('Initializing thesis in database:', thesis.id);
        
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('Error getting current user:', userError);
          throw userError;
        }

        if (!user) {
          throw new Error('No authenticated user found');
        }

        console.log('Current user:', user.id);

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
          
          // Create default sections
          const defaultSections = [
            { id: uuidv4(), title: 'Introduction', content: '', type: 'introduction', order: 1, figures: [], tables: [], citations: [], references: [] },
            { id: uuidv4(), title: 'Literature Review', content: '', type: 'literature-review', order: 2, figures: [], tables: [], citations: [], references: [] },
            { id: uuidv4(), title: 'Methodology', content: '', type: 'methodology', order: 3, figures: [], tables: [], citations: [], references: [] },
            { id: uuidv4(), title: 'Results', content: '', type: 'results', order: 4, figures: [], tables: [], citations: [], references: [] },
            { id: uuidv4(), title: 'Discussion', content: '', type: 'discussion', order: 5, figures: [], tables: [], citations: [], references: [] },
            { id: uuidv4(), title: 'Conclusion', content: '', type: 'conclusion', order: 6, figures: [], tables: [], citations: [], references: [] }
          ];

          const thesisContent = {
            frontMatter: thesis.frontMatter.map(section => ({
              ...section,
              figures: section.figures || [],
              tables: section.tables || [],
              citations: section.citations || [],
              references: section.references || []
            })),
            chapters: [{
              id: uuidv4(),
              title: 'Main Content',
              content: '',
              order: 1,
              sections: defaultSections,
              figures: [],
              tables: [],
              footnotes: []
            }],
            backMatter: thesis.backMatter.map(section => ({
              ...section,
              figures: section.figures || [],
              tables: section.tables || [],
              citations: section.citations || [],
              references: section.references || []
            }))
          } as unknown as Json;

          const { error: thesisError } = await supabase
            .from('theses')
            .insert({
              id: thesis.id,
              title: thesis.title || 'Untitled Thesis',
              content: thesisContent,
              user_id: user.id
            });

          if (thesisError) {
            console.error('Error creating thesis:', thesisError);
            throw thesisError;
          }

          const { error: collaboratorError } = await supabase
            .from('thesis_collaborators')
            .insert({
              thesis_id: thesis.id,
              user_id: user.id,
              role: 'owner'
            });

          if (collaboratorError) {
            console.error('Error adding thesis owner:', collaboratorError);
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