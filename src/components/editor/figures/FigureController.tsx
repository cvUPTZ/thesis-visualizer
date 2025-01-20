import React from 'react';
import { Figure } from '@/types/thesis';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface FigureControllerProps {
  figure: Figure;
  onUpdate: (figure: Figure) => void;
  onDelete: (id: string) => void;
}

export const FigureController: React.FC<FigureControllerProps> = ({
  figure,
  onUpdate,
  onDelete
}) => {
  const handleChange = (field: keyof Figure, value: string) => {
    onUpdate({
      ...figure,
      [field]: value
    });
  };

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={figure.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Enter figure title"
          />
        </div>

        <div className="space-y-2">
          <Label>Caption</Label>
          <Input
            value={figure.caption}
            onChange={(e) => handleChange('caption', e.target.value)}
            placeholder="Enter figure caption"
          />
        </div>

        <div className="space-y-2">
          <Label>Alt Text</Label>
          <Input
            value={figure.alt_text}
            onChange={(e) => handleChange('alt_text', e.target.value)}
            placeholder="Describe the image for accessibility"
          />
        </div>

        <div className="flex justify-end">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(figure.id)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};