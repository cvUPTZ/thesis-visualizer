import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { useToast } from '@/hooks/use-toast';

const AbstractPage = () => {
  const { toast } = useToast();
  const [content, setContent] = React.useState('');
  const [keywords, setKeywords] = React.useState('');

  const handleSave = () => {
    console.log('Saving abstract:', { content, keywords });
    toast({
      title: "Success",
      description: "Abstract has been saved",
    });
  };

  return (
    <div className="container max-w-4xl py-10">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Abstract</h1>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Keywords</label>
            <Input
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Enter keywords (comma separated)"
              className="mb-4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Content</label>
            <MarkdownEditor
              value={content}
              onChange={(value) => setContent(value || '')}
              placeholder="Write your abstract here..."
            />
          </div>
          <Button onClick={handleSave} className="w-full">Save Abstract</Button>
        </div>
      </Card>
    </div>
  );
};

export default AbstractPage;