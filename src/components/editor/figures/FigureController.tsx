import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Figure } from '@/types/thesis';
import { Edit2, Trash2, Move, ZoomIn, ZoomOut, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FigureControllerProps {
  figure: Figure;
  onUpdate: (updatedFigure: Figure) => void;
  onDelete: (id: string) => void;
}

export const FigureController = ({
  figure,
  onUpdate,
  onDelete
}: FigureControllerProps) => {
  const { toast } = useToast();
  const [width, setWidth] = useState(figure.dimensions?.width || 500);
  const [height, setHeight] = useState(figure.dimensions?.height || 300);

  const handleResize = (newWidth: number, newHeight: number) => {
    onUpdate({
      ...figure,
      dimensions: {
        width: newWidth,
        height: newHeight
      }
    });
    toast({
      title: "Figure Resized",
      description: "Figure dimensions updated successfully",
    });
  };

  const handlePositionChange = (newPosition: 'inline' | 'float-left' | 'float-right' | 'center') => {
    onUpdate({
      ...figure,
      position: newPosition
    });
    toast({
      title: "Position Updated",
      description: "Figure position updated successfully",
    });
  };

  const handleMetadataChange = (field: keyof Figure, value: string) => {
    onUpdate({
      ...figure,
      [field]: value
    });
  };

  return (
    <Card className="w-full bg-white shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Figure Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preview */}
        <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={figure.url}
            alt={figure.alt_text}
            className="object-contain w-full h-full"
            style={{ maxWidth: width, maxHeight: height }}
          />
        </div>

        {/* Metadata Controls */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Figure Label</Label>
            <Input
              value={figure.label || ''}
              onChange={(e) => handleMetadataChange('label', e.target.value)}
              placeholder="e.g., Figure 1.1"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={figure.title || ''}
              onChange={(e) => handleMetadataChange('title', e.target.value)}
              placeholder="Enter figure title"
            />
          </div>

          <div className="space-y-2">
            <Label>Caption</Label>
            <Input
              value={figure.caption || ''}
              onChange={(e) => handleMetadataChange('caption', e.target.value)}
              placeholder="Enter figure caption"
            />
          </div>

          <div className="space-y-2">
            <Label>Alt Text</Label>
            <Input
              value={figure.alt_text || ''}
              onChange={(e) => handleMetadataChange('alt_text', e.target.value)}
              placeholder="Describe the image for accessibility"
            />
          </div>
        </div>

        {/* Size Controls */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Width (px)</Label>
            <Slider
              value={[width]}
              onValueChange={(values) => handleResize(values[0], height)}
              min={100}
              max={1000}
              step={10}
            />
          </div>

          <div className="space-y-2">
            <Label>Height (px)</Label>
            <Slider
              value={[height]}
              onValueChange={(values) => handleResize(width, values[0])}
              min={100}
              max={1000}
              step={10}
            />
          </div>
        </div>

        {/* Position Controls */}
        <div className="space-y-2">
          <Label>Position in Document</Label>
          <Select 
            value={figure.position} 
            onValueChange={(value: 'inline' | 'float-left' | 'float-right' | 'center') => handlePositionChange(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inline">Inline with Text</SelectItem>
              <SelectItem value="float-left">Float Left</SelectItem>
              <SelectItem value="float-right">Float Right</SelectItem>
              <SelectItem value="center">Centered</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(figure.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};