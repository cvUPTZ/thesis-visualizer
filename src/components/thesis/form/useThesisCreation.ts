import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Json } from '@/integrations/supabase/types';
import { ThesisSectionType } from '@/types/thesis';

interface ThesisMetadata {
  title: string;
  description: string;
  keywords: string;
  universityName?: string;
  departmentName?: string;
  authorName?: string;
  thesisDate?: string;
  committeeMembers?: string[];
}

export const useThesisCreation = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const createThesis = async (
    metadata: ThesisMetadata,
    userId: string
  ) => {
    setIsSubmitting(true);
    try {
      console.log('Starting thesis creation with metadata:', metadata);

      const thesisId = crypto.randomUUID();
      const now = new Date().toISOString();

      const keywordsArray = metadata.keywords
        ? metadata.keywords.split(',').map(k => k.trim()).filter(k => k)
        : [];

      // Prepare thesis content with proper typing and all required fields
      const thesisContent = {
        id: thesisId,
        title: metadata.title || 'Untitled Thesis',
        description: metadata.description || '',
        status: 'draft',
        created_at: now,
        updated_at: now,
        metadata: {
          description: metadata.description || '',
          keywords: keywordsArray,
          createdAt: now,
          updatedAt: now,
          universityName: metadata.universityName || '',
          departmentName: metadata.departmentName || '',
          authorName: metadata.authorName || '',
          thesisDate: metadata.thesisDate || now.split('T')[0],
          committeeMembers: metadata.committeeMembers || []
        },
        frontMatter: [
          {
            id: crypto.randomUUID(),
            title: metadata.title || 'Untitled Thesis',
            content: '',
            type: 'title' as ThesisSectionType,
            required: true,
            order: 1,
            status: 'draft',
            created_at: now,
            updated_at: now,
            figures: [],
            tables: [],
            citations: []
          },
          {
            id: crypto.randomUUID(),
            title: 'Abstract',
            content: metadata.description || '',
            type: 'abstract' as ThesisSectionType,
            required: true,
            order: 2,
            status: 'draft',
            created_at: now,
            updated_at: now,
            figures: [],
            tables: [],
            citations: []
          }
        ],
        generalIntroduction: {
          id: 'general-introduction',
          title: 'General Introduction',
          content: '',
          type: 'general-introduction' as ThesisSectionType,
          required: true,
          order: 1,
          status: 'draft',
          created_at: now,
          updated_at: now,
          figures: [],
          tables: [],
          citations: [],
          references: []
        },
        chapters: [],
        generalConclusion: {
          id: 'general-conclusion',
          title: 'General Conclusion',
          content: '',
          type: 'general-conclusion' as ThesisSectionType,
          required: true,
          order: 1,
          status: 'draft',
          created_at: now,
          updated_at: now,
          figures: [],
          tables: [],
          citations: [],
          references: []
        },
        backMatter: [
          {
            id: crypto.randomUUID(),
            title: 'References',
            content: '',
            type: 'references' as ThesisSectionType,
            required: true,
            order: 1,
            status: 'draft',
            created_at: now,
            updated_at: now,
            figures: [],
            tables: [],
            citations: []
          }
        ]
      };

      // Insert the new thesis
      const { error: insertError } = await supabase
        .from('theses')
        .insert({
          id: thesisId,
          title: metadata.title,
          content: thesisContent as unknown as Json,
          user_id: userId,
          created_at: now,
          updated_at: now,
          status: 'draft',
          version: '1.0'
        });

      if (insertError) throw insertError;

      // Add user as owner in thesis_collaborators
      const { error: collaboratorError } = await supabase
        .from('thesis_collaborators')
        .insert({
          thesis_id: thesisId,
          user_id: userId,
          role: 'owner',
          created_at: now
        });

      if (collaboratorError) throw collaboratorError;

      toast({
        title: "Success",
        description: "Your thesis has been created successfully.",
        variant: "success"
      });

      return thesisId;

    } catch (error) {
      console.error('Error creating thesis:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create thesis",
        variant: "destructive"
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