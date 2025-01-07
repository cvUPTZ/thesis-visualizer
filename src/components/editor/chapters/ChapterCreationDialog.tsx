import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog } from '@/components/ui/dialog';
import { Figure } from '@/types/thesis';

interface ChapterCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChapterCreate: (chapter: any) => void;
}

export const ChapterCreationDialog: React.FC<ChapterCreationDialogProps> = ({
  open,
  onOpenChange,
  onChapterCreate,
}) => {
  const [title, setTitle] = useState('');
  const [figures, setFigures] = useState<Figure[]>([]);

  const handleAddFigure = (file: File) => {
    const newFigure: Figure = {
      id: Date.now().toString(),
      imageUrl: URL.createObjectURL(file),
      caption: '',
      altText: '',
      title: '', // Add the title field
      number: figures.length + 1 || 1,
      dimensions: {
        width: 0,
        height: 0
      }
    };
    
    setFigures(prevFigures => [...prevFigures, newFigure]);
  };

  const handleCreateChapter = () => {
    const newChapter = {
      title,
      figures,
      sections: []
    };
    onChapterCreate(newChapter);
    setTitle('');
    setFigures([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Dialog.Title>Create New Chapter</Dialog.Title>
        <Dialog.Description>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Chapter Title"
          />
        </Dialog.Description>
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files) {
                Array.from(e.target.files).forEach(handleAddFigure);
              }
            }}
          />
        </div>
        <Button onClick={handleCreateChapter}>Create Chapter</Button>
      </Dialog.Content>
    </Dialog>
  );
};
