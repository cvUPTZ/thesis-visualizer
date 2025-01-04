import React, { useState } from 'react';
import { Figure } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { FigureList } from './editor/managers/FigureList';
import { FigureUpload } from './editor/managers/FigureUpload';
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

  const handleFileUpload = (file: File, figureId: string) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
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

      <FigureList
        figures={figures}
        onRemove={onRemoveFigure}
        onUpdate={onUpdateFigure}
        onPreview={(imageUrl) => setSelectedImage(imageUrl)}
      />

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
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};