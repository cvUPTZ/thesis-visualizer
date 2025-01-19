import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MarkdownEditor } from '@/components/MarkdownEditor';

const AbstractPage = () => {
  const { toast } = useToast();
  const [abstract, setAbstract] = useState('');
  const [keywords, setKeywords] = useState('');

  const handleSave = () => {
    console.log('Saving abstract:', { abstract, keywords });
    toast({
      title: "Success",
      description: "Abstract has been saved",
    });
  };

  return (
    <div className="container max-w-4xl py-10">
      <Card className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Abstract</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Keywords</label>
            <Input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Enter keywords (comma separated)"
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Abstract Content</label>
            <MarkdownEditor
              value={abstract}
              onChange={(value) => setAbstract(value || '')}
              placeholder="Write your abstract here..."
            />
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Abstract
        </Button>
      </Card>
    </div>
  );
};

export default AbstractPage;