import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useForm } from '@/hooks/useForm';
import { supabase } from '@/integrations/supabase/client';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useUser } from '@/hooks/useUser';

const StudentInfo = () => {
  const { toast } = useToast();
  const { user } = useUser();
  const { data: profile, refetch } = useUserProfile(user?.id ?? null);

  const { values, handleChange, handleSubmit, isSubmitting } = useForm({
    initialValues: {
      fullName: profile?.full_name ?? '',
      studentId: profile?.student_id ?? '',
      email: profile?.email ?? '',
      department: profile?.department ?? '',
      program: profile?.program ?? '',
      yearOfStudy: profile?.year_of_study ?? ''
    },
    onSubmit: async (values) => {
      console.log('📝 Submitting student info:', values);
      
      if (!user?.id) {
        console.error('❌ No user ID available');
        toast({
          title: "Error",
          description: "You must be logged in to update your information",
          variant: "destructive"
        });
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: values.fullName,
          student_id: values.studentId,
          department: values.department,
          program: values.program,
          year_of_study: values.yearOfStudy
        })
        .eq('id', user.id);

      if (error) {
        console.error('❌ Error updating profile:', error);
        toast({
          title: "Error",
          description: "Failed to save your information. Please try again.",
          variant: "destructive"
        });
        return;
      }

      console.log('✅ Profile updated successfully');
      toast({
        title: "Success",
        description: "Your information has been saved",
      });
      
      refetch();
    }
  });

  return (
    <div className="container max-w-2xl py-10">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Student Information</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <Input
              name="fullName"
              value={values.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Student ID</label>
            <Input
              name="studentId"
              value={values.studentId}
              onChange={handleChange}
              placeholder="Enter your student ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              placeholder="Enter your email"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            <Input
              name="department"
              value={values.department}
              onChange={handleChange}
              placeholder="Enter your department"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Program</label>
            <Input
              name="program"
              value={values.program}
              onChange={handleChange}
              placeholder="Enter your program"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Year of Study</label>
            <Input
              name="yearOfStudy"
              value={values.yearOfStudy}
              onChange={handleChange}
              placeholder="Enter your year of study"
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Information'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default StudentInfo;