import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const ThesisInfo = () => {
  const { toast } = useToast();
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    keywords: '',
    expectedCompletion: '',
    researchArea: '',
    methodology: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting thesis info:', formData);
    toast({
      title: "Success",
      description: "Thesis information has been saved",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="container max-w-2xl py-10">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Thesis Information</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter thesis title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter thesis description"
              rows={4}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Keywords</label>
            <Input
              name="keywords"
              value={formData.keywords}
              onChange={handleChange}
              placeholder="Enter keywords (comma separated)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Expected Completion Date</label>
            <Input
              name="expectedCompletion"
              type="date"
              value={formData.expectedCompletion}
              onChange={handleChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Research Area</label>
            <Input
              name="researchArea"
              value={formData.researchArea}
              onChange={handleChange}
              placeholder="Enter research area"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Methodology</label>
            <Textarea
              name="methodology"
              value={formData.methodology}
              onChange={handleChange}
              placeholder="Describe your research methodology"
              rows={4}
            />
          </div>
          <Button type="submit" className="w-full">Save Information</Button>
        </form>
      </Card>
    </div>
  );
};

export default ThesisInfo;