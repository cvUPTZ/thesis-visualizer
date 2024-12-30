// File: /src/components/thesis/form/useThesisCreation.ts

import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Json } from '@/integrations/supabase/types';

export const useThesisCreation = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const createThesis = async (
    title: string,
    description: string,
    keywords: string,
    userId: string
  ) => {
    setIsSubmitting(true);
    try {
      console.log('Starting thesis creation with metadata:', { title, description, keywords, userId });

      const thesisId = crypto.randomUUID();

      // Prepare thesis content with proper typing
      const thesisContent = {
        metadata: {
          description,
          keywords: keywords.split(',').map(k => k.trim()),
          createdAt: new Date().toISOString(),
        },
        frontMatter: [
          {
            id: crypto.randomUUID(),
            title: title,
            content: '',
            type: 'title',
            required: true,
            order: 1,
            figures: [],
            tables: [],
            citations: []
          },
          {
            id: crypto.randomUUID(),
            title: 'Abstract',
            content: description,
            type: 'abstract',
            required: true,
            order: 2,
            figures: [],
            tables: [],
            citations: []
          }
        ],
        chapters: [],
        backMatter: [
          {
            id: crypto.randomUUID(),
            title: 'References',
            content: '',
            type: 'references',
            required: true,
            order: 1,
            figures: [],
            tables: [],
            citations: [],
            references: []
          }
        ]
      } as Json;

      console.log('Creating thesis with content:', { thesisId, title, content: thesisContent, userId });

      // Create thesis with metadata and ensure user_id is set
      const { error: thesisError } = await supabase
        .from('theses')
        .insert({
          id: thesisId,
          title: title,
          content: thesisContent,
          user_id: userId
        });

      if (thesisError) {
        console.error('Error creating thesis:', thesisError);
        throw thesisError;
      }

      // Add user as owner
      const { error: collaboratorError } = await supabase
        .from('thesis_collaborators')
        .insert({
          thesis_id: thesisId,
          user_id: userId,
          role: 'owner'
        });

      if (collaboratorError) {
        console.error('Error adding thesis owner:', collaboratorError);
        // Rollback thesis creation
        await supabase
          .from('theses')
          .delete()
          .eq('id', thesisId);
        throw collaboratorError;
      }

      toast({
        title: "Success",
        description: "Your thesis has been created successfully.",
      });

      // Return thesisId and title
      return {
          thesisId,
          title
      };


    } catch (error: any) {
      console.error('Error in thesis creation:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create thesis. Please try again.",
        variant: "destructive",
      });
       return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createThesis,
    isSubmitting
  };
};