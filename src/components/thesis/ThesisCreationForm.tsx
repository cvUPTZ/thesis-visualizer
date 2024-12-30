import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { Json } from '@/integrations/supabase/types';

export const ThesisCreationForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        console.error('Authentication error:', error);
        toast({
          title: "Authentication Required",
          description: "Please sign in to create a thesis.",
          variant: "destructive",
        });
        navigate('/auth');
      }
    };
    
    checkAuth();
  }, [navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Starting thesis creation with metadata');
      
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error getting current user:', userError);
        throw userError;
      }

      if (!user) {
        throw new Error('No authenticated user found');
      }

      console.log('Creating thesis for user:', user.id);

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
      } as unknown as Json;

      // Create thesis with metadata
      const { data: newThesis, error: thesisError } = await supabase
        .from('theses')
        .insert({
          id: thesisId,
          title: title,
          content: thesisContent,
          user_id: user.id
        })
        .select()
        .single();

      if (thesisError) {
        console.error('Error creating thesis:', thesisError);
        throw thesisError;
      }

      console.log('Created thesis:', newThesis);

      // Add user as owner
      const { error: collaboratorError } = await supabase
        .from('thesis_collaborators')
        .insert({
          thesis_id: thesisId,
          user_id: user.id,
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

      // Navigate to the thesis editor
      navigate(`/thesis/${thesisId}`);

    } catch (error: any) {
      console.error('Error in thesis creation:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create thesis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Create New Thesis</h1>
        <p className="text-muted-foreground">
          Enter the details of your thesis to get started.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter thesis title"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of your thesis"
            required
          />
        </div>

        <div>
          <label htmlFor="keywords" className="block text-sm font-medium mb-1">
            Keywords
          </label>
          <Input
            id="keywords"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="Enter keywords separated by commas"
            required
          />
          <p className="text-sm text-muted-foreground mt-1">
            Separate keywords with commas (e.g., AI, Machine Learning, Data Science)
          </p>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating...' : 'Create Thesis'}
      </Button>
    </form>
  );
};