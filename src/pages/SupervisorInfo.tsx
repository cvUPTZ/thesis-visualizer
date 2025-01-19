import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const SupervisorInfo = () => {
  const { toast } = useToast();
  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    department: '',
    office: '',
    phoneNumber: '',
    officeHours: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting supervisor info:', formData);
    toast({
      title: "Success",
      description: "Supervisor information has been saved",
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
        <h1 className="text-2xl font-bold mb-6">Supervisor Information</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <Input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter supervisor's full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter supervisor's email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Department</label>
            <Input
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="Enter department"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Office</label>
            <Input
              name="office"
              value={formData.office}
              onChange={handleChange}
              placeholder="Enter office location"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <Input
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Office Hours</label>
            <Input
              name="officeHours"
              value={formData.officeHours}
              onChange={handleChange}
              placeholder="Enter office hours"
            />
          </div>
          <Button type="submit" className="w-full">Save Information</Button>
        </form>
      </Card>
    </div>
  );
};

export default SupervisorInfo;