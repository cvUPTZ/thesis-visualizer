import React from 'react';
import { ChaptersList } from '@/components/chapters/ChaptersList';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Chapter } from '@/types/thesis';
import { PlusCircle } from 'lucide-react';

const ChaptersPage = () => {
  const [chapters, setChapters] = React.useState<Chapter[]>([]);
  const [newChapterTitle, setNewChapterTitle] = React.useState('');
  const { toast } = useToast();

  const handleCreateChapter = () => {
    if (!newChapterTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a chapter title",
        variant: "destructive",
      });
      return;
    }

    const newChapter: Chapter = {
      id: Date.now().toString(),
      title: newChapterTitle,
      content: '',
      sections: [],
      part: chapters.length + 1,
      figures: [],
      tables: [],
      footnotes: []
    };

    setChapters([...chapters, newChapter]);
    setNewChapterTitle('');
    
    toast({
      title: "Success",
      description: "Chapter created successfully",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Chapters</h1>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="Enter chapter title"
          value={newChapterTitle}
          onChange={(e) => setNewChapterTitle(e.target.value)}
          className="max-w-md"
        />
        <Button onClick={handleCreateChapter}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Chapter
        </Button>
      </div>

      <ChaptersList chapters={chapters} />
    </div>
  );
};

export default ChaptersPage;