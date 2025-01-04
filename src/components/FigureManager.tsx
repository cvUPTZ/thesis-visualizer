import React, { useState } from 'react';
import { Figure } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, X, Image, ZoomIn, ZoomOut, Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  const handleAddFigure = () => {
    const newFigure: Figure = {
      id: Date.now().toString(),
      caption: '',
      imageUrl: '',
      altText: '',
      number: figures.length + 1,
      dimensions: { width: 0, height: 0 }
    };
    onAddFigure(newFigure);
  };

  const onDrop = (acceptedFiles: File[], figureId: string) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const figure = figures.find(f => f.id === figureId);
          if (figure) {
            onUpdateFigure({
              ...figure,
              imageUrl: e.target?.result as string,
              dimensions: {
                width: img.width,
                height: img.height
              }
            });
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        onDrop(acceptedFiles, figures[0]?.id);
      }
    }
  });

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
              <div className="flex gap-2">
                {figure.imageUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedImage(figure.imageUrl)}
                    className="h-8 w-8 p-0"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveFigure(figure.id)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div
                {...getRootProps()}
                className="relative aspect-video mb-4 bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 border-dashed border-gray-300 hover:border-primary transition-colors"
              >
                <input {...getInputProps()} />
                {figure.imageUrl ? (
                  <img
                    src={figure.imageUrl}
                    alt={figure.altText}
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <p className="text-sm text-gray-500 mt-2">Drop image here or click to upload</p>
                  </div>
                )}
              </div>
              {figure.dimensions && (
                <div className="text-sm text-gray-500 mb-2">
                  Dimensions: {figure.dimensions.width}x{figure.dimensions.height}px
                </div>
              )}
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

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Figure Preview</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <div className="flex justify-center">
              <img
                src={selectedImage || ''}
                alt="Preview"
                style={{ transform: `scale(${zoom})` }}
                className="transition-transform duration-200"
              />
            </div>
            <div className="absolute bottom-4 right-4 flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setZoom(Math.min(2, zoom + 0.1))}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
