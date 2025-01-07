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
      title: '',
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
      id: Date.now().toString(),
      title,
      figures,
      sections: [],
      order: 1
    };
    onChapterCreate(newChapter);
    setTitle('');
    setFigures([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Chapter</DialogTitle>
          <DialogDescription>
            <div className="space-y-4">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Chapter Title"
                className="w-full"
              />
              <div>
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
              <Button onClick={handleCreateChapter} className="w-full">
                Create Chapter
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};