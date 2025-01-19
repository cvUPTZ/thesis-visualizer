import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const StudentInfo = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const studentData = {
      full_name: formData.get('full_name')?.toString() || '',
      student_id: formData.get('student_id')?.toString() || '',
      department: formData.get('department')?.toString() || '',
      program: formData.get('program')?.toString() || '',
      year_of_study: formData.get('year_of_study')?.toString() || '',
    };

    try {
      const { error } = await supabase
        .from('profiles')
        .update(studentData)
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Student information updated successfully.",
      });
    } catch (error) {
      console.error('Error updating student information:', error);
      toast({
        title: "Error",
        description: "Failed to update student information. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Student Information</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium">Full Name</label>
          <input type="text" name="full_name" id="full_name" required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        </div>
        <div>
          <label htmlFor="student_id" className="block text-sm font-medium">Student ID</label>
          <input type="text" name="student_id" id="student_id" required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        </div>
        <div>
          <label htmlFor="department" className="block text-sm font-medium">Department</label>
          <input type="text" name="department" id="department" required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        </div>
        <div>
          <label htmlFor="program" className="block text-sm font-medium">Program</label>
          <input type="text" name="program" id="program" required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        </div>
        <div>
          <label htmlFor="year_of_study" className="block text-sm font-medium">Year of Study</label>
          <input type="text" name="year_of_study" id="year_of_study" required className="mt-1 block w-full border border-gray-300 rounded-md p-2" />
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded">Update Information</button>
      </form>
    </div>
  );
};

export default StudentInfo;