import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Figure } from '@/types/thesis';
import { useToast } from '@/hooks/use-toast';

interface ChapterFiguresProps {
  chapter: {
    figures: Figure[];
  };
  onUpdateChapter: (updatedChapter: any) => void;
}

export const ChapterFigures: React.FC<ChapterFiguresProps> = ({
  chapter,
  onUpdateChapter
}) => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState(0);
  const [newFigureFile, setNewFigureFile] = useState<File | null>(null);

  const handleAddFigure = (file: File) => {
    const newFigure: Figure = {
      id: Date.now().toString(),
      imageUrl: URL.createObjectURL(file),
      caption: '',
      altText: '',
      title: '', // Add the title field
      number: chapter.figures?.length + 1 || 1,
      dimensions: {
        width: 0,
        height: 0
      }
    };

    onUpdateChapter({
      ...chapter,
      figures: [...chapter.figures, newFigure]
    });

    toast({
      title: "Figure Added",
      description: "New figure has been added successfully",
    });
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setNewFigureFile(file);
      handleAddFigure(file);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold">Figures</h3>
      <div className="flex items-center gap-2 mb-4">
        <Input type="file" accept="image/*" onChange={handleFileChange} />
        <Button onClick={() => newFigureFile && handleAddFigure(newFigureFile)}>
          Add Figure
        </Button>
      </div>
      <div>
        {chapter.figures.map((figure) => (
          <div key={figure.id} className="flex items-center justify-between mb-2">
            <img src={figure.imageUrl} alt={figure.altText} className="w-20 h-20 object-cover" />
            <div className="flex flex-col">
              <span className="font-medium">{figure.title}</span>
              <span className="text-sm text-gray-500">{figure.caption}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
