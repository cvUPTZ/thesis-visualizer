import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

const StudentInfo = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.get('full_name')?.toString() || '',
          student_id: formData.get('student_id')?.toString() || '',
          department: formData.get('department')?.toString() || '',
          program: formData.get('program')?.toString() || '',
          year_of_study: formData.get('year_of_study')?.toString() || ''
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your information has been updated successfully."
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update your information. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Student Information</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium">
            Full Name
          </label>
          <input
            type="text"
            name="full_name"
            id="full_name"
            defaultValue={profile?.full_name || ''}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label htmlFor="student_id" className="block text-sm font-medium">
            Student ID
          </label>
          <input
            type="text"
            name="student_id"
            id="student_id"
            defaultValue={profile?.student_id || ''}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label htmlFor="department" className="block text-sm font-medium">
            Department
          </label>
          <input
            type="text"
            name="department"
            id="department"
            defaultValue={profile?.department || ''}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label htmlFor="program" className="block text-sm font-medium">
            Program
          </label>
          <input
            type="text"
            name="program"
            id="program"
            defaultValue={profile?.program || ''}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label htmlFor="year_of_study" className="block text-sm font-medium">
            Year of Study
          </label>
          <input
            type="text"
            name="year_of_study"
            id="year_of_study"
            defaultValue={profile?.year_of_study || ''}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <Button type="submit" className="mt-4">
          Update Information
        </Button>
      </form>
    </div>
  );
};

export default StudentInfo;