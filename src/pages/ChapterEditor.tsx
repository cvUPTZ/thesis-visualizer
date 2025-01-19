import React from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const ChapterEditor = () => {
  const { chapterId } = useParams();
  const { toast } = useToast();
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');

  const handleSave = () => {
    // TODO: Implement save functionality
    toast({
      title: "Success",
      description: "Chapter saved successfully",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <Input
              placeholder="Chapter Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-bold"
            />
          </div>
          
          <div>
            <Textarea
              placeholder="Chapter content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[400px]"
            />
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChapterEditor;