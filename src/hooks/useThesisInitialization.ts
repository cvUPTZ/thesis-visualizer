import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Thesis } from '@/types/thesis';
import { Json } from '@/integrations/supabase/types';

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
          .maybeSingle();

        if (checkError) {
          console.error('Error checking thesis:', checkError);
          throw checkError;
        }

        if (!existingThesis) {
          console.log('Creating new thesis with user_id:', user.id);
          
          // Convert thesis sections to JSON-compatible format
          const convertSectionToJson = (section: any) => ({
            id: section.id,
            title: section.title,
            content: section.content,
            type: section.type,
            required: section.required,
            order: section.order,
            figures: section.figures?.map((f: any) => ({
              id: f.id,
              caption: f.caption,
              imageUrl: f.imageUrl,
              altText: f.altText,
              number: f.number
            })) || [],
            tables: section.tables?.map((t: any) => ({
              id: t.id,
              caption: t.caption,
              headers: t.headers,
              rows: t.rows,
              number: t.number
            })) || [],
            citations: section.citations?.map((c: any) => ({
              id: c.id,
              text: c.text,
              source: c.source,
              authors: c.authors,
              year: c.year,
              type: c.type
            })) || [],
            references: section.references?.map((r: any) => ({
              id: r.id,
              title: r.title,
              authors: r.authors,
              year: r.year,
              doi: r.doi,
              url: r.url,
              journal: r.journal,
              volume: r.volume,
              issue: r.issue,
              pages: r.pages,
              publisher: r.publisher,
              type: r.type
            })) || []
          });
          
          // Convert thesis content to a JSON-compatible format
          const thesisContent: Json = {
            frontMatter: thesis.frontMatter.map(convertSectionToJson),
            chapters: thesis.chapters.map(chapter => ({
              id: chapter.id,
              title: chapter.title,
              order: chapter.order,
              sections: chapter.sections.map(convertSectionToJson)
            })),
            backMatter: thesis.backMatter.map(convertSectionToJson)
          };
          
          // Create the thesis
          const { data: newThesis, error: thesisError } = await supabase
            .from('theses')
            .insert({
              id: thesis.id,
              title: 'Untitled Thesis',
              content: thesisContent,
              user_id: user.id
            })
            .select()
            .single();

          if (thesisError) {
            console.error('Error creating thesis:', thesisError);
            throw thesisError;
          }

          console.log('Created new thesis:', newThesis);

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
  }, [thesis.id, toast]);
};