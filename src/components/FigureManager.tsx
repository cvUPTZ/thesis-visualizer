import React from 'react';
import { Figure } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, X, Image } from 'lucide-react';

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-serif font-medium text-primary">Figures</h3>
        <Button onClick={handleAddFigure} variant="outline" size="sm" className="gap-2">
          <PlusCircle className="w-4 h-4" />
          Add Figure
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {figures.map((figure) => (
          <Card key={figure.id} className="border-2 border-editor-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Image className="w-4 h-4 inline mr-2" />
                Figure {figure.number}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveFigure(figure.id)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {figure.imageUrl && (
                <div className="relative aspect-video mb-4 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={figure.imageUrl}
                    alt={figure.altText}
                    className="object-contain w-full h-full"
                  />
                </div>
              )}
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};