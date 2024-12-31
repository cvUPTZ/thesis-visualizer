import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useForm } from '@/hooks/useForm';
import { ThesisMetadataFields } from '@/components/thesis/form/ThesisMetadataFields';
import { useThesisCreation } from '@/components/thesis/form/useThesisCreation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';

export const ThesisCreationForm = () => {
  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setFieldValue,
    handleArrayChange,
  } = useForm({
    initialValues: {
      title: '',
      description: '',
      keywords: '',
      universityName: '',
      departmentName: '',
      authorName: '',
      thesisDate: '',
      committeeMembers: ['', '', ''],
    },
    validate: (values) => {
      const errors = {};
      if (!values.title) errors.title = 'Title is required';
      if (!values.description) errors.description = 'Description is required';
      if (!values.keywords) errors.keywords = 'Keywords are required';
      return errors;
    },
    onSubmit: async (values) => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.user?.id) {
          setError('You must be logged in to create a thesis');
          return;
        }

        const metadata = { ...values, keywords: values.keywords.split(',').map((kw) => kw.trim()) };

        const result = await createThesis(metadata, session.user.id);

        if (result?.thesisId) {
          navigate(`/thesis/${result.thesisId}`);
        } else {
          toast({ title: 'Error', description: 'Failed to create thesis', variant: 'destructive' });
        }
      } catch (error) {
        setError('An unexpected error occurred. Please try again later.');
        console.error('Thesis creation error:', error);
      }
    },
  });

  const [error, setError] = useState(null);
  const { createThesis } = useThesisCreation();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error: authError } = await supabase.auth.getSession();
        if (authError || !session) {
          toast({
            title: 'Authentication Required',
            description: 'Please sign in to create a thesis.',
            variant: 'destructive',
          });
          navigate('/auth');
        }
      } catch (err) {
        console.error('Error during authentication check:', err);
      }
    };
    checkAuth();
  }, [navigate, toast]);

  const handleCommitteeMemberChange = (index, value) => {
    handleArrayChange('committeeMembers', index, value);
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

          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Title
            </label>
            <Input
              id="title"
              name="title"
              value={values.title}
              onChange={handleChange}
              placeholder="Enter thesis title"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <Input
              id="description"
              name="description"
              value={values.description}
              onChange={handleChange}
              placeholder="Enter a brief description of your thesis"
              required
            />
          </div>

          <div>
            <label htmlFor="keywords" className="block text-sm font-medium mb-1">
              Keywords
            </label>
            <Input
              id="keywords"
              name="keywords"
              value={values.keywords}
              onChange={handleChange}
              placeholder="Enter keywords separated by commas"
              required
            />
          </div>

          <div>
            <label htmlFor="universityName" className="block text-sm font-medium mb-1">
              University Name
            </label>
            <Input
              id="universityName"
              name="universityName"
              value={values.universityName}
              onChange={handleChange}
              placeholder="Enter university name"
              required
            />
          </div>

          <div>
            <label htmlFor="departmentName" className="block text-sm font-medium mb-1">
              Department Name
            </label>
            <Input
              id="departmentName"
              name="departmentName"
              value={values.departmentName}
              onChange={handleChange}
              placeholder="Enter department name"
              required
            />
          </div>

          <div>
            <label htmlFor="authorName" className="block text-sm font-medium mb-1">
              Author Name
            </label>
            <Input
              id="authorName"
              name="authorName"
              value={values.authorName}
              onChange={handleChange}
              placeholder="Enter author name"
              required
            />
          </div>

          <div>
            <label htmlFor="thesisDate" className="block text-sm font-medium mb-1">
              Thesis Date
            </label>
            <Input
              id="thesisDate"
              name="thesisDate"
              value={values.thesisDate}
              onChange={handleChange}
              placeholder="Enter date of thesis submission"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Committee Members</label>
            {values.committeeMembers.map((member, index) => (
              <Input
                key={index}
                name={`committeeMembers[${index}]`}
                value={member}
                onChange={(e) => handleCommitteeMemberChange(index, e.target.value)}
                placeholder={`Committee Member ${index + 1}`}
                className="mb-2"
              />
            ))}
          </div>

          <Button type="submit" disabled={isSubmitting} className="mt-6">
            {isSubmitting ? 'Creating...' : 'Create Thesis'}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};
