import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from 'react-router-dom';
  import { useForm } from '@/hooks/useForm';
 import { ThesisMetadataFields } from '@/components/thesis/form/ThesisMetadataFields';
import { useThesisCreation } from '@/components/thesis/form/useThesisCreation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";

interface ThesisCreationModalProps {
    onThesisCreated: (thesisId: string, title: string) => void;
}

export const ThesisCreationModal = ({ onThesisCreated }: ThesisCreationModalProps) => {
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

        return err;
     },
    onSubmit: async (values) => {
      const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) {
            setError('You must be logged in to create a thesis');
           return;
         }

           const metadata = {
              ...values,
                keywords: values.keywords
           };
         const result = await createThesis(metadata, session.user.id);

           if (result?.thesisId) {
            setOpen(false);
            onThesisCreated(result.thesisId, values.title);
            navigate(`/thesis/${result.thesisId}`);
           }
      }
 });

    const [error, setError] = useState<string | null>(null);
      const { createThesis } = useThesisCreation();
    const { toast } = useToast();
    const navigate = useNavigate();
  const [open, setOpen] = useState(false);

     const handleCommitteeMemberChange = (index: number, value: string) => {
        handleArrayChange('committeeMembers', index, value)
      };

   return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create New Thesis</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl mx-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Create New Thesis</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
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
               <label className="block text-sm font-medium mb-1">
                   Committee Members
                 </label>
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
        </form>
      </DialogContent>
    </Dialog>
  );
};
