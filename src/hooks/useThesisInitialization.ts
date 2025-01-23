import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Thesis } from '@/types/thesis';
import { Json } from '@/integrations/supabase/types';

export const useThesisInitialization = (thesis: Thesis | null) => {
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