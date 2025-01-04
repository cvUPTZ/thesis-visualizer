import React, { useState } from 'react';
import { Figure } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FigureUploadModal } from './editor/managers/figure/FigureUploadModal';
import { FigureGrid } from './editor/managers/figure/FigureGrid';
import { Dialog, DialogContent } from './ui/dialog';

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
  const [isAddingFigure, setIsAddingFigure] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAddFigure = (figureData: { 
    imageUrl: string; 
    caption: string; 
    altText: string;
    dimensions: { width: number; height: number };
  }) => {
    const figure: Figure = {
      id: crypto.randomUUID(),
      ...figureData,
      number: figures.length + 1,
    };

    onAddFigure(figure);
    toast({
      title: "Success",
      description: "Figure added successfully",
    });
  };

  console.log('Rendering FigureManager:', { 
    figuresCount: figures.length,
    isAddingFigure,
    hasSelectedImage: !!selectedImage
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-serif font-medium text-primary">Figures</h3>
        <Button 
          onClick={() => setIsAddingFigure(true)} 
          variant="outline" 
          size="sm" 
          className="gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Add Figure
        </Button>
      </div>

      <FigureGrid
        figures={figures}
        onRemove={onRemoveFigure}
        onUpdate={onUpdateFigure}
        onPreview={setSelectedImage}
      />

      <FigureUploadModal
        open={isAddingFigure}
        onClose={() => setIsAddingFigure(false)}
        onUpload={handleAddFigure}
      />

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <div className="relative">
            <div className="flex justify-center">
              <img
                src={selectedImage || ''}
                alt="Preview"
                className="max-h-[70vh] object-contain"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};