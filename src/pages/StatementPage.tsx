import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MarkdownEditor } from '@/components/MarkdownEditor';

const StatementPage = () => {
  const { toast } = useToast();
  const [content, setContent] = useState('');

  const handleSave = () => {
    console.log('Saving statement:', content);
    toast({
      title: "Success",
      description: "Statement has been saved",
    });
  };

  return (
    <div className="container max-w-4xl py-10">
      <Card className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Statement</h1>
        
        <div>
          <MarkdownEditor
            value={content}
            onChange={(value) => setContent(value || '')}
            placeholder="Write your statement here..."
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Statement
        </Button>
      </Card>
    </div>
  );
};

export default StatementPage;