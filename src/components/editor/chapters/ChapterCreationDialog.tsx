import React from 'react';
import { Chapter, Figure } from '@/types/thesis';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { v4 as uuidv4 } from 'uuid';

interface ChapterCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChapterCreate: (chapter: Chapter) => void;
}

export const ChapterCreationDialog: React.FC<ChapterCreationDialogProps> = ({
  open,
  onOpenChange,
  onChapterCreate
}) => {
  const [title, setTitle] = React.useState('');

  const handleCreate = () => {
    const newFigure: Figure = {
      id: uuidv4(),
      imageUrl: '',
      caption: '',
      altText: '',
      title: '',
      number: 1,
      dimensions: { width: 0, height: 0 },
      position: 'center'
    };

    const newChapter: Chapter = {
      id: uuidv4(),
      title: title || 'Untitled Chapter',
      content: '',
      order: 1,
      sections: [],
      figures: [newFigure]
    };

    onChapterCreate(newChapter);
    setTitle('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Chapter</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder="Chapter Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <Button onClick={handleCreate} className="w-full">
            Create Chapter
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};