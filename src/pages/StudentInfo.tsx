import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const StudentInfo = () => {
  const { toast } = useToast();
  const [formData, setFormData] = React.useState({
    fullName: '',
    studentId: '',
    email: '',
    department: '',
    program: '',
    yearOfStudy: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting student info:', formData);
    toast({
      title: "Success",
      description: "Student information has been saved",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="container max-w-2xl py-10">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Student Information</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <Input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Student ID</label>
            <Input
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="Enter your student ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            <Input
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Enter your department"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Program</label>
            <Input
              name="program"
              value={formData.program}
              onChange={handleChange}
              placeholder="Enter your program"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Year of Study</label>
            <Input
              name="yearOfStudy"
              value={formData.yearOfStudy}
              onChange={handleChange}
              placeholder="Enter your year of study"
            />
          </div>
          <Button type="submit" className="w-full">Save Information</Button>
        </form>
      </Card>
    </div>
  );
};

export default StudentInfo;