import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { ThesisMetadataFields } from './form/ThesisMetadataFields';
import { useThesisCreation } from './form/useThesisCreation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const ThesisCreationForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { createThesis, isSubmitting } = useThesisCreation();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error: authError } = await supabase.auth.getSession();
      if (authError || !session) {
        console.error('Authentication error:', authError);
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
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user?.id) {
      setError('You must be logged in to create a thesis');
      return;
    }

    await createThesis(title, description, keywords, session.user.id);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create New Thesis</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <ThesisMetadataFields
            title={title}
            description={description}
            keywords={keywords}
            setTitle={setTitle}
            setDescription={setDescription}
            setKeywords={setKeywords}
          />

          <Button type="submit" disabled={isSubmitting} className="mt-6">
            {isSubmitting ? 'Creating...' : 'Create Thesis'}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};