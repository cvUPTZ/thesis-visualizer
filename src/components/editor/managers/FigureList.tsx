import React from 'react';
import { Figure } from '@/types/thesis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, ZoomIn } from 'lucide-react';

interface FigureListProps {
  figures: Figure[];
  onRemove: (id: string) => void;
  onUpdate: (figure: Figure) => void;
  onPreview: (imageUrl: string) => void;
}

export const FigureList = ({ figures, onRemove, onUpdate, onPreview }: FigureListProps) => {
  console.log('Rendering FigureList:', { figuresCount: figures.length });

  const handleInputChange = (
    figureId: string,
    field: 'caption' | 'altText',
    value: string
  ) => {
    const figure = figures.find(f => f.id === figureId);
    if (figure) {
      console.log('Updating figure:', { figureId, field, value });
      onUpdate({
        ...figure,
        [field]: value
      });
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {figures.map((figure) => (
        <Card key={figure.id} className="border-2 border-editor-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Figure {figure.number}
            </CardTitle>
            <div className="flex gap-2">
              {figure.imageUrl && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPreview(figure.imageUrl)}
                  className="h-8 w-8 p-0"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(figure.id)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input
              placeholder="Caption"
              value={figure.caption || ''}
              onChange={(e) => handleInputChange(figure.id, 'caption', e.target.value)}
              className="mb-2"
            />
            <Input
              placeholder="Alt Text"
              value={figure.altText || ''}
              onChange={(e) => handleInputChange(figure.id, 'altText', e.target.value)}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};