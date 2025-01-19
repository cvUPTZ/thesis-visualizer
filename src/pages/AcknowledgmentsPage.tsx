import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MarkdownEditor } from '@/components/MarkdownEditor';

const AcknowledgmentsPage = () => {
  const { toast } = useToast();
  const [content, setContent] = useState('');

  const handleSave = () => {
    console.log('Saving acknowledgments:', content);
    toast({
      title: "Success",
      description: "Acknowledgments have been saved",
    });
  };

  return (
    <div className="container max-w-4xl py-10">
      <Card className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Acknowledgments</h1>
        
        <div>
          <MarkdownEditor
            value={content}
            onChange={(value) => setContent(value || '')}
            placeholder="Write your acknowledgments here..."
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Acknowledgments
        </Button>
      </Card>
    </div>
  );
};

export default AcknowledgmentsPage;