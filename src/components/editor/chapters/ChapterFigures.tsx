import React from 'react';
import { Chapter, Figure } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { FigureUpload } from '../managers/FigureUpload';
import { Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface ChapterFiguresProps {
  chapter: Chapter;
  onUpdateChapter: (chapter: Chapter) => void;
}

export const ChapterFigures: React.FC<ChapterFiguresProps> = ({
  chapter,
  onUpdateChapter
}) => {
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      
      const img = new Image();
      img.onload = () => {
        const newFigure: Figure = {
          id: Date.now().toString(),
          imageUrl,
          caption: '',
          altText: '',
          number: (chapter.sections[0]?.figures?.length || 0) + 1,
          dimensions: {
            width: img.width,
            height: img.height
          }
        };

        if (chapter.sections[0]) {
          const updatedSections = [...chapter.sections];
          updatedSections[0] = {
            ...updatedSections[0],
            figures: [...(updatedSections[0].figures || []), newFigure]
          };

          onUpdateChapter({
            ...chapter,
            sections: updatedSections
          });

          toast({
            title: "Figure Added",
            description: "New figure has been added to the chapter",
          });
        }
      };
      img.src = imageUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFigure = (figureId: string) => {
    const updatedSections = chapter.sections.map(section => ({
      ...section,
      figures: section.figures.filter(f => f.id !== figureId)
    }));

    onUpdateChapter({
      ...chapter,
      sections: updatedSections
    });

    toast({
      title: "Figure Removed",
      description: "Figure has been removed from the chapter",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Figures</h3>
        <FigureUpload onUpload={handleFileUpload} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {chapter.sections[0]?.figures?.map((figure) => (
          <div key={figure.id} className="border p-4 rounded-lg group relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveFigure(figure.id)}
              className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <img src={figure.imageUrl} alt={figure.altText} className="w-full h-40 object-contain" />
            <Input
              placeholder="Caption"
              value={figure.caption}
              onChange={(e) => {
                const updatedSections = [...chapter.sections];
                updatedSections[0].figures = updatedSections[0].figures.map(f =>
                  f.id === figure.id ? { ...f, caption: e.target.value } : f
                );
                onUpdateChapter({
                  ...chapter,
                  sections: updatedSections
                });
              }}
              className="mt-2"
            />
          </div>
        ))}
      </div>
    </div>
  );
};