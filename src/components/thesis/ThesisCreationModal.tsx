import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useNotification } from "@/contexts/NotificationContext";
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {  Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { thesisService } from '@/services/thesisService';
const thesisSchema = z.object({
    title: z.string().min(1, "Title is required"),
   description: z.string().min(1, "Description is required"),
    keywords: z.string().min(1, "Keywords are required"),
    universityName: z.string().optional(),
    departmentName: z.string().optional(),
    authorName: z.string().optional(),
    thesisDate: z.string().optional(),
   committeeMembers: z.array(z.string()).optional(),
});

type ThesisSchemaType = z.infer<typeof thesisSchema>;

interface ThesisCreationModalProps {
    onThesisCreated: (thesisId: string, title: string) => void;
}

export const ThesisCreationModal = ({ onThesisCreated }: ThesisCreationModalProps) => {
    const { toast } = useNotification();
    const navigate = useNavigate();
    const [error, setError] = useState<string | null>(null);
    const { register, handleSubmit, formState: { errors, isSubmitting }, control, setValue } = useForm<ThesisSchemaType>({
        resolver: zodResolver(thesisSchema),
      defaultValues: {
            title: '',
            description: '',
            keywords: '',
            universityName: '',
            departmentName: '',
            authorName: '',
            thesisDate: '',
            committeeMembers: ['', '', ''],
       }
    });

    const [open, setOpen] = useState(false);

    const onSubmit = async (values: ThesisSchemaType) => {
        const { data: { session } } = await supabase.auth.getSession();
         if (!session?.user?.id) {
            setError('You must be logged in to create a thesis');
            return;
       }
        try {
          const metadata = {
              ...values,
              keywords: values.keywords,
            };

           const result = await thesisService.createThesis(metadata, session.user.id);

           if (result?.thesisId) {
               setOpen(false);
             onThesisCreated(result.thesisId, values.title);
               navigate(`/thesis/${result.thesisId}`);
            }
        } catch (error: any) {
           setError(error.message);
        }
  };

  const handleCommitteeMemberChange = (index: number, value: string) => {
        const updatedCommitteeMembers = [...(control._defaultValues?.committeeMembers as string[] || [])];
      updatedCommitteeMembers[index] = value;
        setValue('committeeMembers', updatedCommitteeMembers, { shouldValidate: true});
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
               <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                           {...register("title")}
                          placeholder="Enter thesis title"
                         required
                         className={errors.title ? 'border-destructive' : ''}
                       />
                       {errors.title && (
                         <p className="text-sm text-destructive mt-1">
                            {errors.title.message}
                            </p>
                        )}
                   </div>

                  <div>
                      <label htmlFor="description" className="block text-sm font-medium mb-1">
                           Description
                      </label>
                       <Input
                           id="description"
                           {...register("description")}
                          placeholder="Enter a brief description of your thesis"
                         required
                         className={errors.description ? 'border-destructive' : ''}
                       />
                      {errors.description && (
                        <p className="text-sm text-destructive mt-1">
                          {errors.description.message}
                           </p>
                        )}
                    </div>

                  <div>
                      <label htmlFor="keywords" className="block text-sm font-medium mb-1">
                           Keywords
                       </label>
                       <Input
                            id="keywords"
                            {...register("keywords")}
                           placeholder="Enter keywords separated by commas"
                           required
                          className={errors.keywords ? 'border-destructive' : ''}
                      />
                        {errors.keywords && (
                           <p className="text-sm text-destructive mt-1">
                              {errors.keywords.message}
                            </p>
                        )}
                   </div>

                    <div>
                      <label htmlFor="universityName" className="block text-sm font-medium mb-1">
                        University Name
                     </label>
                       <Input
                         id="universityName"
                          {...register("universityName")}
                          placeholder="Enter university name"
                      />
                   </div>

                    <div>
                       <label htmlFor="departmentName" className="block text-sm font-medium mb-1">
                          Department Name
                      </label>
                        <Input
                            id="departmentName"
                            {...register("departmentName")}
                          placeholder="Enter department name"
                        />
                  </div>

                  <div>
                     <label htmlFor="authorName" className="block text-sm font-medium mb-1">
                           Author Name
                       </label>
                       <Input
                            id="authorName"
                          {...register("authorName")}
                          placeholder="Enter author name"
                        />
                   </div>

                   <div>
                       <label htmlFor="thesisDate" className="block text-sm font-medium mb-1">
                            Thesis Date
                      </label>
                     <Input
                           id="thesisDate"
                         {...register("thesisDate")}
                          placeholder="Enter date of thesis submission"
                        />
                   </div>

                  <div>
                       <label className="block text-sm font-medium mb-1">
                           Committee Members
                      </label>
                       {control._defaultValues?.committeeMembers?.map((member, index) => (
                         <Input
                              key={index}
                              placeholder={`Committee Member ${index + 1}`}
                               value={member}
                            onChange={(e) => handleCommitteeMemberChange(index, e.target.value)}
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