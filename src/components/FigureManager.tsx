import React from 'react';
import { Figure } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, X } from 'lucide-react';

interface FigureManagerProps {
  figures: Figure[];
  onAddFigure: (figure: Figure) => void;
  onRemoveFigure: (id: string) => void;
  onUpdateFigure: (figure: Figure) => void;
}

export const FigureManager = ({
  figures,
  onAddFigure,
  onRemoveFigure,
  onUpdateFigure
}: FigureManagerProps) => {
  const handleAddFigure = () => {
    const newFigure: Figure = {
      id: Date.now().toString(),
      caption: '',
      imageUrl: '',
      altText: '',
      number: figures.length + 1
    };
    onAddFigure(newFigure);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Figures</h3>
        <Button onClick={handleAddFigure} variant="outline" size="sm">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Figure
        </Button>
      </div>
      {figures.map((figure) => (
        <div key={figure.id} className="border rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium">Figure {figure.number}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveFigure(figure.id)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <Input
            placeholder="Image URL"
            value={figure.imageUrl}
            onChange={(e) =>
              onUpdateFigure({ ...figure, imageUrl: e.target.value })
            }
            className="mb-2"
          />
          <Input
            placeholder="Caption"
            value={figure.caption}
            onChange={(e) =>
              onUpdateFigure({ ...figure, caption: e.target.value })
            }
            className="mb-2"
          />
          <Input
            placeholder="Alt Text"
            value={figure.altText}
            onChange={(e) =>
              onUpdateFigure({ ...figure, altText: e.target.value })
            }
          />
        </div>
      ))}
    </div>
  );
};