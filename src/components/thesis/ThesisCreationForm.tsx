import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
import { useForm } from '@/hooks/useForm';
import { useThesisCreation } from '@/components/thesis/form/useThesisCreation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BasicThesisFields } from './form/BasicThesisFields';
import { InstitutionFields } from './form/InstitutionFields';
import { AuthorFields } from './form/AuthorFields';
import { CommitteeFields } from './form/CommitteeFields';
import { ArrowLeft } from 'lucide-react';

export const ThesisCreationForm = () => {
  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    handleArrayChange
  } = useForm({
    initialValues: {
      title: '',
      description: '',
      keywords: '',
      supervisorEmail: '',
      universityName: '',
      departmentName: '',
      authorName: '',
      thesisDate: '',
      committeeMembers: ['', '', ''],
    },
    validate: (values) => {
      const err: any = {};
      if (!values.title) {
        err.title = "Title is required";
      }
      if (!values.description) {
        err.description = "Description is required";
      }
      if (!values.keywords) {
        err.keywords = "Keywords are required";
      }
      if (!values.supervisorEmail) {
        err.supervisorEmail = "Supervisor email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.supervisorEmail)) {
        err.supervisorEmail = "Invalid email address";
      }
      return err;
    },
    onSubmit: async (values) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        setError('You must be logged in to create a thesis');
        return;
      }

      // First, look up the supervisor's profile
      const { data: supervisorProfile, error: supervisorError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', values.supervisorEmail.toLowerCase())
        .maybeSingle();

      if (supervisorError) {
        console.error('Error looking up supervisor:', supervisorError);
        setError('Failed to find supervisor profile');
        return;
      }

      if (!supervisorProfile) {
        setError('Supervisor not found. Please ensure the email is correct.');
        return;
      }

      // Create the thesis with supervisor_id
      const metadata = {
        ...values,
        keywords: values.keywords
      };

      const result = await createThesis(metadata, session.user.id, supervisorProfile.id);

      if (result?.thesisId) {
        // Create a notification for the supervisor
        const { error: notificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: supervisorProfile.id,
            thesis_id: result.thesisId,
            type: 'supervisor_request',
            message: `You have been assigned as supervisor for thesis "${values.title}"`
          });

        if (notificationError) {
          console.error('Error creating notification:', notificationError);
          toast({
            title: "Warning",
            description: "Thesis created but failed to notify supervisor",
            variant: "destructive",
          });
        }

        // Navigate to the thesis page
        navigate(`/thesis/${result.thesisId}`);
      }
    },
  });

  const [error, setError] = useState<string | null>(null);
  const { createThesis } = useThesisCreation();
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6 relative">
      <Button
        variant="ghost"
        size="icon"
        className="absolute -top-2 -left-2"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-6 w-6" />
      </Button>

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

          <div className="space-y-6">
            <BasicThesisFields values={values} handleChange={handleChange} />
            <InstitutionFields values={values} handleChange={handleChange} />
            <AuthorFields values={values} handleChange={handleChange} />
            <CommitteeFields
              committeeMembers={values.committeeMembers}
              handleCommitteeMemberChange={handleCommitteeMemberChange}
            />
            
            <div className="flex gap-4">
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="flex-1"
              >
                {isSubmitting ? 'Creating...' : 'Create Thesis'}
              </Button>
              <Button 
                type="button" 
                variant="destructive" 
                onClick={handleCancel}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};