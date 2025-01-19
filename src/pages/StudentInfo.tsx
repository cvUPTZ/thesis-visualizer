import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useForm } from '@/hooks/useForm';
import { supabase } from '@/integrations/supabase/client';
import { useUser } from '@/hooks/useUser';

interface StudentInfoForm {
  fullName: string;
  studentId: string;
  email: string;
  department: string;
  program: string;
  yearOfStudy: string;
}

const StudentInfo = () => {
  const { toast } = useToast();
  const { user } = useUser();

  const { values, handleChange, handleSubmit, isSubmitting } = useForm<StudentInfoForm>({
    initialValues: {
      fullName: '',
      studentId: '',
      email: '',
      department: '',
      program: '',
      yearOfStudy: ''
    },
    onSubmit: async (values) => {
      if (!user?.id) {
        toast({
          title: "Error",
          description: "You must be logged in to save student information",
          variant: "destructive"
        });
        return;
      }

      try {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: values.fullName,
            student_id: values.studentId,
            email: values.email,
            department: values.department,
            program: values.program,
            year_of_study: values.yearOfStudy
          })
          .eq('id', user.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Student information has been saved",
        });
      } catch (error) {
        console.error('Error saving student info:', error);
        toast({
          title: "Error",
          description: "Failed to save student information",
          variant: "destructive"
        });
      }
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