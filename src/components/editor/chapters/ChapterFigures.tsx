import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Figure } from '@/types/thesis';

interface ChapterFiguresProps {
  chapter: {
    id?: string;
    figures?: Figure[];
  };
  onUpdateChapter: (updatedChapter: any) => void;
}

export const ChapterFigures: React.FC<ChapterFiguresProps> = ({
  chapter,
  onUpdateChapter
}) => {
  const [newFigureFile, setNewFigureFile] = useState<File | null>(null);
  const { toast } = useToast();

  console.log('ChapterFigures rendering with:', { 
    chapterId: chapter?.id,
    figuresCount: chapter?.figures?.length 
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setNewFigureFile(e.target.files[0]);
    }
  };

  const handleAddFigure = (file: File) => {
    const figures = chapter.figures || [];
    const newFigure: Figure = {
      id: Date.now().toString(),
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

    console.log('Adding new figure:', newFigure);

    onUpdateChapter({
      ...chapter,
      figures: [...figures, newFigure]
    });

    toast({
      title: "Success",
      description: "Figure added successfully",
    });

    setNewFigureFile(null);
  };

  // Ensure figures is always an array
  const figures = chapter.figures || [];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Figures</h3>
      <div className="flex items-center gap-2 mb-4">
        <Input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange}
          className="flex-1"
        />
        <Button 
          onClick={() => newFigureFile && handleAddFigure(newFigureFile)}
          disabled={!newFigureFile}
        >
          Add Figure
        </Button>
      </div>
      <div className="space-y-4">
        {figures.map((figure) => (
          <div 
            key={figure.id} 
            className="flex items-center justify-between p-4 bg-background rounded-lg border"
          >
            <img 
              src={figure.imageUrl} 
              alt={figure.altText} 
              className="w-20 h-20 object-cover rounded-md"
            />
            <div className="flex flex-col flex-1 ml-4">
              <span className="font-medium">{figure.title || 'Untitled Figure'}</span>
              <span className="text-sm text-muted-foreground">
                {figure.caption || 'No caption'}
              </span>
            </div>
          </div>
        ))}
        {figures.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No figures added yet. Upload an image to get started.
          </div>
        )}
      </div>
    </div>
  );
};