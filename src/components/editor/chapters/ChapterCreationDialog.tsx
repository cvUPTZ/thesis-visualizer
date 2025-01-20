import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Chapter, Figure } from '@/types/thesis';
import { useToast } from '@/hooks/use-toast';

interface ChapterCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChapterCreate: (chapter: Chapter) => void;
}

export const ChapterCreationDialog: React.FC<ChapterCreationDialogProps> = ({
  open,
  onOpenChange,
  onChapterCreate,
}) => {
  const [title, setTitle] = useState('');
  const [figures, setFigures] = useState<Figure[]>([]);
  const { toast } = useToast();

  console.log('ChapterCreationDialog rendering with:', { open, title });

  const handleAddFigure = (file: File) => {
    const newFigure: Figure = {
      id: crypto.randomUUID(),
      imageUrl: URL.createObjectURL(file),
      caption: '',
      altText: '',
      title: '',
      number: figures.length + 1,
      dimensions: {
        width: 0,
        height: 0
      }
    };
    
    setFigures(prevFigures => [...prevFigures, newFigure]);
  };

  const handleCreateChapter = () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Chapter title is required",
        variant: "destructive"
      });
      return;
    }

    const newChapter: Chapter = {
      id: crypto.randomUUID(),
      title: title.trim(),
      content: '',
      sections: [],
      part: 1,
      figures: figures,
      tables: [],
      footnotes: []
    };

    console.log('Creating new chapter:', newChapter);
    
    onChapterCreate(newChapter);
    setTitle('');
    setFigures([]);
    onOpenChange(false);

    toast({
      title: "Success",
      description: "Chapter created successfully",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Chapter</DialogTitle>
          <DialogDescription>
            Add a new chapter to your thesis. Enter the chapter title and add any initial figures if needed.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Chapter Title"
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">
              Add Figures (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) {
                  Array.from(e.target.files).forEach(handleAddFigure);
                }
              }}
              className="w-full"
            />
          </div>
          <Button 
            onClick={handleCreateChapter} 
            className="w-full"
            disabled={!title.trim()}
          >
            Create Chapter
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};