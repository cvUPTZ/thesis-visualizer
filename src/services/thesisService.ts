// File: src/services/thesisService.ts

import { supabase } from '@/integrations/supabase/client';
import { Thesis, Chapter, Section, Reference } from '@/types/thesis';
import { Json } from '@/integrations/supabase/types';
import { Profile } from '@/types/profile';
import { Collaborator } from '@/types/collaborator';
import { z } from 'zod';

// Zod Schema for Thesis Content
const thesisContentSchema = z.object({
    metadata: z.object({
        description: z.string(),
        keywords: z.array(z.string()),
        createdAt: z.string(),
        universityName: z.string().optional(),
        departmentName: z.string().optional(),
        authorName: z.string().optional(),
        thesisDate: z.string().optional(),
        committeeMembers: z.array(z.string()).optional()
    }),
    frontMatter: z.array(z.object({
        id: z.string(),
        title: z.string(),
        content: z.string(),
        type: z.string(),
        required: z.boolean().optional(),
        order: z.number(),
        figures: z.array(z.object({
            id: z.string(),
            caption: z.string(),
            imageUrl: z.string(),
            altText: z.string(),
            number: z.number()
        })),
        tables: z.array(z.object({
            id: z.string(),
            caption: z.string(),
            headers: z.array(z.string()),
            rows: z.array(z.array(z.string())),
            number: z.number()
        })),
        citations: z.array(z.object({
            id: z.string(),
            text: z.string(),
            source: z.string(),
            authors: z.array(z.string()),
            year: z.string(),
            type: z.string(),
        })),
        references: z.array(z.object({
            id: z.string(),
            title: z.string(),
            authors: z.array(z.string()),
            year: z.string(),
            doi: z.string().optional(),
            url: z.string().optional(),
            journal: z.string().optional(),
            volume: z.string().optional(),
            issue: z.string().optional(),
            pages: z.string().optional(),
            publisher: z.string().optional(),
            type: z.string(),
        })).optional()
    })),
    chapters: z.array(z.object({
        id: z.string(),
        title: z.string(),
        order: z.number(),
        sections: z.array(z.object({
            id: z.string(),
            title: z.string(),
            content: z.string(),
            type: z.string(),
            required: z.boolean().optional(),
            order: z.number(),
            figures: z.array(z.object({
                id: z.string(),
                caption: z.string(),
                imageUrl: z.string(),
                altText: z.string(),
                number: z.number()
            })),
            tables: z.array(z.object({
                id: z.string(),
                caption: z.string(),
                headers: z.array(z.string()),
                rows: z.array(z.array(z.string())),
                number: z.number()
            })),
            citations: z.array(z.object({
                id: z.string(),
                text: z.string(),
                source: z.string(),
                authors: z.array(z.string()),
                year: z.string(),
                type: z.string(),
            })),
            references: z.array(z.object({
                id: z.string(),
                title: z.string(),
                authors: z.array(z.string()),
                year: z.string(),
                doi: z.string().optional(),
                url: z.string().optional(),
                journal: z.string().optional(),
                volume: z.string().optional(),
                issue: z.string().optional(),
                pages: z.string().optional(),
                publisher: z.string().optional(),
                type: z.string(),
            })).optional()
        }))
    })),
    backMatter: z.array(z.object({
        id: z.string(),
        title: z.string(),
        content: z.string(),
        type: z.string(),
        required: z.boolean().optional(),
        order: z.number(),
        figures: z.array(z.object({
            id: z.string(),
            caption: z.string(),
            imageUrl: z.string(),
            altText: z.string(),
            number: z.number()
        })),
        tables: z.array(z.object({
            id: z.string(),
            caption: z.string(),
            headers: z.array(z.string()),
            rows: z.array(z.array(z.string())),
            number: z.number()
        })),
        citations: z.array(z.object({
            id: z.string(),
            text: z.string(),
            source: z.string(),
            authors: z.array(z.string()),
            year: z.string(),
            type: z.string(),
        })),
        references: z.array(z.object({
            id: z.string(),
            title: z.string(),
            authors: z.array(z.string()),
            year: z.string(),
            doi: z.string().optional(),
            url: z.string().optional(),
            journal: z.string().optional(),
            volume: z.string().optional(),
            issue: z.string().optional(),
            pages: z.string().optional(),
            publisher: z.string().optional(),
            type: z.string(),
        })).optional()
    }))
});


export const thesisService = {
    async createThesis(metadata: any, userId: string): Promise<{ thesisId: string, title: string } | null> {
        try {
            console.log('Starting thesis creation with metadata:', metadata);

            const thesisId = crypto.randomUUID();
            const keywordsArray = metadata.keywords
                ? metadata.keywords.split(',').map((k: string) => k.trim()).filter((k: string) => k)
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
                        content: metadata.description,
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

            console.log('Creating thesis with content:', { thesisId, title: metadata.title, content: thesisContent, userId });

            // Create thesis with metadata and ensure user_id is set
            const { error: thesisError } = await supabase
                .from('theses')
                .insert({
                    id: thesisId,
                    title: metadata.title,
                    content: thesisContent,
                    user_id: userId,
                });

            if (thesisError) {
                console.error('Error creating thesis:', thesisError);
                throw new Error(thesisError.message);
            }

            // Add user as owner
            const { error: collaboratorError } = await supabase
                .from('thesis_collaborators')
                .insert({
                    thesis_id: thesisId,
                    user_id: userId,
                    role: 'owner',
                });

            if (collaboratorError) {
                console.error('Error adding thesis owner:', collaboratorError);
                // Rollback thesis creation
                await supabase
                    .from('theses')
                    .delete()
                    .eq('id', thesisId);
                throw new Error(collaboratorError.message);
            }

            // Return thesisId and title
            return {
                thesisId,
                title: metadata.title
            };
        } catch (error: any) {
            console.error('Error in thesis creation:', error);
            throw new Error(error.message || 'Failed to create thesis. Please try again.')
        }
    },

    async getThesis(thesisId: string): Promise<Thesis | null> {
        try {
            console.log('Fetching thesis with ID:', thesisId);
            const { data, error } = await supabase
                .from('theses')
                .select('*')
                .eq('id', thesisId)
                .maybeSingle();

            if (error) {
                console.error('Error fetching thesis:', error);
                throw new Error(error.message);
            }

            if (!data) {
                console.log('No thesis found with ID:', thesisId);
                return null;
            }

           const content = typeof data.content === 'string' ? JSON.parse(data.content) : data.content;

            // Ensure all required properties are present
            const thesisData: Thesis = {
                id: data.id,
                metadata: {
                    description: content.metadata.description || '',
                    keywords: content.metadata.keywords || [],
                    createdAt: content.metadata.createdAt || new Date().toISOString(),
                    universityName: content.metadata.universityName,
                    departmentName: content.metadata.departmentName,
                    authorName: content.metadata.authorName,
                    thesisDate: content.metadata.thesisDate,
                    committeeMembers: content.metadata.committeeMembers || []
                },
                frontMatter: content.frontMatter.map((section: any) => ({
                    id: section.id || crypto.randomUUID(),
                    title: section.title || '',
                    content: section.content || '',
                    type: section.type || 'custom',
                    required: section.required || false,
                    order: section.order || 0,
                    figures: section.figures || [],
                    tables: section.tables || [],
                    citations: section.citations || [],
                    references: section.references || []
                })),
                chapters: content.chapters.map((chapter: any) => ({
                    id: chapter.id || crypto.randomUUID(),
                    title: chapter.title || '',
                    order: chapter.order || 0,
                    sections: (chapter.sections || []).map((section: any) => ({
                        id: section.id || crypto.randomUUID(),
                        title: section.title || '',
                        content: section.content || '',
                        type: section.type || 'custom',
                        required: section.required || false,
                        order: section.order || 0,
                        figures: section.figures || [],
                        tables: section.tables || [],
                        citations: section.citations || [],
                        references: section.references || []
                    }))
                })),
                backMatter: content.backMatter.map((section: any) => ({
                    id: section.id || crypto.randomUUID(),
                    title: section.title || '',
                    content: section.content || '',
                    type: section.type || 'custom',
                    required: section.required || false,
                    order: section.order || 0,
                    figures: section.figures || [],
                    tables: section.tables || [],
                    citations: section.citations || [],
                    references: section.references || []
                }))
            };

            return thesisData;
        } catch (error: any) {
            console.error('Error in getThesis:', error);
            throw new Error(error.message || 'Failed to fetch thesis. Please try again.');
        }
    },

    async updateThesis(thesisId: string, thesis: Thesis): Promise<void> {
        try {
            console.log('Updating thesis:', thesisId);
            const { error } = await supabase
                .from('theses')
                .update({
                    content: JSON.parse(JSON.stringify({
                        metadata: thesis.metadata,
                        frontMatter: thesis.frontMatter,
                        chapters: thesis.chapters,
                        backMatter: thesis.backMatter
                    })) as Json,
                    updated_at: new Date().toISOString()
                })
                .eq('id', thesisId);
            if (error) {
                console.error('Error updating thesis:', error);
                throw new Error(error.message);
            }
        } catch (error: any) {
            console.error('Error updating thesis:', error);
            throw new Error(error.message || 'Failed to update thesis. Please try again.');
        }
    },

    async initializeThesis(thesis: Thesis): Promise<void> {
        try {
            console.log('Initializing thesis in database:', thesis.id);
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) {
                console.error('Error getting current user:', userError);
                throw new Error(userError.message);
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
                 throw new Error(profileError.message);
            }

            console.log('User profile:', profile);
           const { data: existingThesis, error: checkError } = await supabase
                .from('theses')
                .select('*')
               .eq('id', thesis.id)
              .maybeSingle();
            if (checkError) {
                console.error('Error checking thesis:', checkError);
                throw new Error(checkError.message);
            }

            if (!existingThesis) {
                console.log('Creating new thesis with user_id:', user.id);

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
                    throw new Error(thesisError.message);
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
                   throw new Error(collaboratorError.message);
                }
                console.log('Added user as thesis owner');

            }
        } catch (error: any) {
            console.error('Error in thesis initialization:', error);
            throw new Error(error.message || 'Failed to initialize thesis. Please try again.');
        }
    },

    async fetchCollaborators(thesisId: string): Promise<Collaborator[]> {
        try {
            console.log('Fetching collaborators for thesis:', thesisId);
           const { data, error } = await supabase
                .from('thesis_collaborators')
                .select(`
                  user_id,
                   role,
                  created_at,
                   profiles (
                      email,
                    roles (name)
                  )
                 `)
                .eq('thesis_id', thesisId);
            if (error) {
                console.error('Error fetching collaborators:', error);
                 throw new Error(error.message);
            }
          return data.map(item => ({
             ...item,
             profiles: {
                 ...item.profiles,
                  role: item.profiles?.roles?.name
               }
           })) as Collaborator[];
        } catch (error: any) {
           console.error('Error in fetchCollaborators:', error);
            throw new Error(error.message || 'Failed to fetch collaborators. Please try again.');
        }
    },


   async getUserProfile(userId: string): Promise<Profile | null> {
       try {
           const { data, error } = await supabase
                .from('profiles')
                .select(`
                  id,
                    email,
                  created_at,
                  roles(name)
               `)
               .eq('id', userId)
               .maybeSingle();

             if (error) {
                console.error('Error fetching profile:', error);
                 throw new Error(error.message);
           }
            if (!data) {
                return null;
           }
            return {
               id: data.id,
               email: data.email,
                role: data.roles?.name,
              created_at: data.created_at
            } as Profile;

        } catch (error: any) {
           console.error('Error in getUserProfile:', error);
             throw new Error(error.message || 'Failed to fetch user profile. Please try again.');
        }
    },

    async saveToJson(thesis: Thesis) {
        try {
            const jsonData = JSON.stringify(thesis, null, 2);
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `thesis_${thesis.id}_${new Date().toISOString()}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
             console.error('Error saving thesis to JSON:', error);
            throw new Error('Failed to save thesis as JSON file.');
       }
    }
};