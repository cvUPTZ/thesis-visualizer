import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, ZoomIn, Pencil } from 'lucide-react';
import { Figure } from '@/types/thesis';

interface FigureCardProps {
  figure: Figure;
  onRemove: (id: string) => void;
  onUpdate: (figure: Figure) => void;
  onPreview: (imageUrl: string) => void;
}

export const FigureCard = ({ figure, onRemove, onUpdate, onPreview }: FigureCardProps) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedCaption, setEditedCaption] = React.useState(figure.caption || '');
  const [editedAltText, setEditedAltText] = React.useState(figure.altText || '');

  const handleUpdate = () => {
    onUpdate({
      ...figure,
      caption: editedCaption,
      altText: editedAltText
    });
    setIsEditing(false);
  };

  return (
    <Card className="group relative transition-all duration-200 hover:shadow-lg">
      <CardHeader className="space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex justify-between items-center">
          <span>Figure {figure.number}</span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onPreview(figure.imageUrl)}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
              onClick={() => onRemove(figure.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div 
          className="w-full aspect-video bg-accent/10 rounded-md overflow-hidden cursor-pointer"
          onClick={() => onPreview(figure.imageUrl)}
        >
          <img
            src={figure.imageUrl}
            alt={figure.altText}
            className="w-full h-full object-contain hover:scale-105 transition-transform"
          />
        </div>

        {isEditing ? (
          <div className="space-y-3 animate-fade-in">
            <div className="space-y-2">
              <Label>Caption</Label>
              <Input
                value={editedCaption}
                onChange={(e) => setEditedCaption(e.target.value)}
                placeholder="Enter caption"
              />
            </div>
            <div className="space-y-2">
              <Label>Alt Text</Label>
              <Input
                value={editedAltText}
                onChange={(e) => setEditedAltText(e.target.value)}
                placeholder="Enter alt text"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm line-clamp-2">{figure.caption || 'No caption'}</p>
            <p className="text-xs text-muted-foreground line-clamp-1">
              Alt: {figure.altText || 'No alt text'}
            </p>
          </div>
        )}
      </CardContent>
      {isEditing && (
        <CardFooter className="justify-end space-x-2 pt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={handleUpdate}
          >
            Save
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};