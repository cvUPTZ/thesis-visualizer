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

         const keywordsArray = metadata.keywords
             ? metadata.keywords.split(',').map(k => k.trim()).filter(k => k)
             : [];

         // Prepare thesis content with proper typing
         const thesisContent = {
           metadata: {
             description: metadata.description,
            keywords: keywordsArray,
                 createdAt: new Date().toISOString(),
              universityName: metadata.universityName,
               departmentName: metadata.departmentName,
                 authorName: metadata.authorName,
                 thesisDate: metadata.thesisDate,
               committeeMembers: metadata.committeeMembers
           },
           frontMatter: [
             {
               id: crypto.randomUUID(),
               title: metadata.title,
              content: '',
               type: 'title' as ThesisSectionType,
                required: true,
               order: 1,
               figures: [],
               tables: [],
               citations: []
            },
            {
             id: crypto.randomUUID(),
               title: 'Abstract',
               content: metadata.description,
               type: 'abstract' as ThesisSectionType,
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
                    type: 'references' as ThesisSectionType,
                     required: true,
                     order: 1,
                     figures: [],
                     tables: [],
                     citations: [],
                    references: []
               }
            ]
         } as Json;

         console.log('Creating thesis with content:', { thesisId, title: metadata.title, content: thesisContent, userId });

         // Create thesis with metadata and ensure user_id is set
         const { error: thesisError } = await supabase
             .from('theses')
             .insert({
               id: thesisId,
               title: metadata.title,
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
           title: metadata.title
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