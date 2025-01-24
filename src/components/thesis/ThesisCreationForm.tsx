import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { useForm } from '@/hooks/useForm';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BasicThesisFields } from './form/BasicThesisFields';
import { InstitutionFields } from './form/InstitutionFields';
import { AuthorFields } from './form/AuthorFields';
import { CommitteeFields } from './form/CommitteeFields';
import { ArrowLeft } from 'lucide-react';

interface ThesisFormValues {
  title: string;
  description: string;
  keywords: string;
  universityName: string;
  departmentName: string;
  authorName: string;
  thesisDate: string;
  committeeMembers: string[];
}

export const ThesisCreationForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [error, setError] = useState<string | null>(null);

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleArrayChange,
    handleSubmit
  } = useForm<ThesisFormValues>({
    initialValues: {
      title: '',
      description: '',
      keywords: '',
      universityName: '',
      departmentName: '',
      authorName: '',
      thesisDate: '',
      committeeMembers: ['', '', '']
    },
    validate: (values) => {
      const errors: Partial<Record<keyof ThesisFormValues, string>> = {};
      if (!values.title.trim()) errors.title = "Title is required";
      if (!values.description.trim()) errors.description = "Description is required";
      if (!values.keywords.trim()) errors.keywords = "Keywords are required";
      if (values.committeeMembers.filter(m => m.trim()).length < 1) {
        errors.committeeMembers = "At least one committee member is required";
      }
      return errors;
    },
    onSubmit: async (values) => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) throw new Error("Authentication required");

        const committeeMembers = values.committeeMembers
          .filter(m => m.trim())
          .map(name => ({ name: name.trim() }));

        const { data, error } = await supabase
          .from('theses')
          .insert({
            title: values.title,
            user_id: session.user.id,
            content: {
              metadata: {
                description: values.description,
                keywords: values.keywords.split(',').map(k => k.trim()),
                universityName: values.universityName.trim(),
                departmentName: values.departmentName.trim(),
                authors: [{ name: values.authorName.trim() }],
                supervisors: [],
                committeeMembers: committeeMembers,
                thesisDate: values.thesisDate || new Date().toISOString(),
              },
              frontMatter: [],
              chapters: [],
              backMatter: []
            },
            status: 'draft'
          })
          .select('id')
          .single();

        if (error) throw error;
        if (!data?.id) throw new Error("Failed to create thesis");

        navigate(`/thesis/${data.id}`);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
        toast({
          title: "Creation Failed",
          variant: "destructive",
          description: error instanceof Error ? error.message : 'Please try again',
        });
      }
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) navigate('/login');
    };
    checkAuth();
  }, [navigate]);

  const handleCommitteeChange = (index: number, value: string) => {
    handleArrayChange('committeeMembers', index, value);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CardTitle>Create New Thesis</CardTitle>
          </div>
        </CardHeader>
        
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <BasicThesisFields
              values={values}
              errors={errors}
              onChange={handleChange}
            />

            <InstitutionFields
              values={values}
              errors={errors}
              onChange={handleChange}
            />

            <AuthorFields
              values={values}
              errors={errors}
              onChange={handleChange}
            />

            <CommitteeFields
              committeeMembers={values.committeeMembers}
              handleCommitteeMemberChange={handleCommitteeChange}
            />

            {errors.committeeMembers && (
              <Alert variant="destructive">
                <AlertDescription>{errors.committeeMembers}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating...' : 'Create Thesis'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};