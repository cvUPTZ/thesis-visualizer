import React from 'react';
import { Figure } from '@/types/thesis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, ZoomIn } from 'lucide-react';
import { Label } from '@/components/ui/label';

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
    field: 'title' | 'caption' | 'alt_text',
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
              {figure.label}
            </CardTitle>
            <div className="flex gap-2">
              {figure.url && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onPreview(figure.url)}
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
          <CardContent className="space-y-4">
            {figure.url && (
              <img
                src={figure.url}
                alt={figure.alt_text || 'Figure preview'}
                className="w-full h-32 object-contain bg-accent/10 rounded-lg"
              />
            )}
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  placeholder="Enter title"
                  value={figure.title || ''}
                  onChange={(e) => handleInputChange(figure.id, 'title', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Caption</Label>
                <Input
                  placeholder="Enter caption"
                  value={figure.caption || ''}
                  onChange={(e) => handleInputChange(figure.id, 'caption', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Alt Text</Label>
                <Input
                  placeholder="Enter alt text"
                  value={figure.alt_text || ''}
                  onChange={(e) => handleInputChange(figure.id, 'alt_text', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};