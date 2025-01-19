import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { useToast } from '@/hooks/use-toast';

const PrefacePage = () => {
  const { toast } = useToast();
  const [content, setContent] = React.useState('');

  const handleSave = () => {
    console.log('Saving preface:', content);
    toast({
      title: "Success",
      description: "Preface has been saved",
    });
  };

  return (
    <div className="container max-w-4xl py-10">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Preface</h1>
        <div className="space-y-6">
          <MarkdownEditor
            value={content}
            onChange={(value) => setContent(value || '')}
            placeholder="Write your preface here..."
          />
          <Button onClick={handleSave} className="w-full">Save Preface</Button>
        </div>
      </Card>
    </div>
  );
};

export default PrefacePage;