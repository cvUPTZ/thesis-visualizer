import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { useToast } from '@/hooks/use-toast';

const AcknowledgmentsPage = () => {
  const { toast } = useToast();
  const [content, setContent] = React.useState('');

  const handleSave = () => {
    console.log('Saving acknowledgments:', content);
    toast({
      title: "Success",
      description: "Acknowledgments have been saved",
    });
  };

  return (
    <div className="container max-w-4xl py-10">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Acknowledgments</h1>
        <div className="space-y-6">
          <MarkdownEditor
            value={content}
            onChange={(value) => setContent(value || '')}
            placeholder="Write your acknowledgments here..."
          />
          <Button onClick={handleSave} className="w-full">Save Acknowledgments</Button>
        </div>
      </Card>
    </div>
  );
};

export default AcknowledgmentsPage;