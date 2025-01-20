import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Figure } from '@/types/thesis';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ImagePlus, Move, ZoomIn, ZoomOut } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

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
  const [selectedFigure, setSelectedFigure] = useState<Figure | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const newFigure: Figure = {
            id: Date.now().toString(),
            url: event.target?.result as string,
            title: '',
            caption: '',
            alt_text: '',
            label: `Figure ${(chapter.figures?.length || 0) + 1}`,
            dimensions: {
              width: img.width,
              height: img.height
            },
            position: 'inline'
          };

          onUpdateChapter({
            ...chapter,
            figures: [...(chapter.figures || []), newFigure]
          });

          toast({
            title: "Figure Added",
            description: "New figure has been added successfully",
          });
        };
        img.src = event.target?.result as string;
      };

      reader.readAsDataURL(file);
    }
  };

  const handleFigureUpdate = (figureId: string, updates: Partial<Figure>) => {
    const updatedFigures = chapter.figures?.map(fig =>
      fig.id === figureId ? { ...fig, ...updates } : fig
    );

    onUpdateChapter({
      ...chapter,
      figures: updatedFigures
    });

    toast({
      title: "Figure Updated",
      description: "Figure details have been updated successfully",
    });
  };

  const handleResize = (figureId: string, width: number, height: number) => {
    handleFigureUpdate(figureId, {
      dimensions: { width, height }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Figures</h3>
        <div className="flex items-center gap-2">
          <Input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            className="max-w-xs"
          />
          <Button variant="outline" onClick={() => document.querySelector('input[type="file"]')?.click()}>
            <ImagePlus className="w-4 h-4 mr-2" />
            Add Figure
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {chapter.figures?.map((figure) => (
          <Card key={figure.id} className="w-full">
            <CardHeader>
              <CardTitle className="text-lg font-medium">
                {figure.label || 'Untitled Figure'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={figure.url}
                  alt={figure.alt_text}
                  className="object-contain w-full h-full"
                  style={{
                    maxWidth: figure.dimensions?.width,
                    maxHeight: figure.dimensions?.height
                  }}
                />
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Label</Label>
                  <Input
                    value={figure.label}
                    onChange={(e) => handleFigureUpdate(figure.id, { label: e.target.value })}
                    placeholder="e.g., Figure 1.1"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={figure.title}
                    onChange={(e) => handleFigureUpdate(figure.id, { title: e.target.value })}
                    placeholder="Enter figure title"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Caption</Label>
                  <Textarea
                    value={figure.caption}
                    onChange={(e) => handleFigureUpdate(figure.id, { caption: e.target.value })}
                    placeholder="Enter figure caption"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Alt Text</Label>
                  <Input
                    value={figure.alt_text}
                    onChange={(e) => handleFigureUpdate(figure.id, { alt_text: e.target.value })}
                    placeholder="Describe the image for accessibility"
                  />
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Width (px)</Label>
                    <Slider
                      value={[figure.dimensions?.width || 500]}
                      onValueChange={(values) => handleResize(figure.id, values[0], figure.dimensions?.height || 300)}
                      min={100}
                      max={1000}
                      step={10}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Height (px)</Label>
                    <Slider
                      value={[figure.dimensions?.height || 300]}
                      onValueChange={(values) => handleResize(figure.id, figure.dimensions?.width || 500, values[0])}
                      min={100}
                      max={1000}
                      step={10}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Position in Document</Label>
                  <Select 
                    value={figure.position} 
                    onValueChange={(value) => handleFigureUpdate(figure.id, { position: value as 'inline' | 'float-left' | 'float-right' | 'center' })}
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
              </div>
            </CardContent>
          </Card>
        ))}

        {(!chapter.figures || chapter.figures.length === 0) && (
          <div className="text-center py-8 text-muted-foreground">
            No figures added yet. Upload an image to get started.
          </div>
        )}
      </div>
    </div>
  );
};