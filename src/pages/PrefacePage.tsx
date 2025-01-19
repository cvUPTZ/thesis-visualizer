import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MarkdownEditor } from '@/components/MarkdownEditor';

const PrefacePage = () => {
  const { toast } = useToast();
  const [content, setContent] = useState('');

  const handleSave = () => {
    console.log('Saving preface:', content);
    toast({
      title: "Success",
      description: "Preface has been saved",
    });
  };

  return (
    <div className="container max-w-4xl py-10">
      <Card className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Preface</h1>
        
        <div>
          <MarkdownEditor
            value={content}
            onChange={(value) => setContent(value || '')}
            placeholder="Write your preface here..."
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Preface
        </Button>
      </Card>
    </div>
  );
};

export default PrefacePage;