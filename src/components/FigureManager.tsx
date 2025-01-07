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
import { useToast } from '@/hooks/use-toast';

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
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { toast } = useToast();

  console.log('Rendering FigureManager:', { figuresCount: figures?.length });

  const handleFileUpload = async (file: File) => {
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        
        // Create a temporary image to get dimensions
        const img = new Image();
        img.onload = () => {
          const newFigure: Figure = {
            id: Date.now().toString(),
            imageUrl,
            caption: '',
            altText: '',
            number: (figures?.length || 0) + 1,
            dimensions: {
              width: img.width,
              height: img.height
            }
          };
          
          console.log('Adding new figure:', newFigure);
          onAddFigure(newFigure);
          setIsAddingFigure(false);
          
          toast({
            title: "Figure Added",
            description: "New figure has been added successfully.",
          });
        };
        img.src = imageUrl;
        setPreviewImage(imageUrl);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading figure:', error);
      toast({
        title: "Error",
        description: "Failed to add figure. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePreview = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
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

      <Dialog open={isAddingFigure} onOpenChange={setIsAddingFigure}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Figure</DialogTitle>
          </DialogHeader>
          <FigureUpload
            onUpload={handleFileUpload}
            imageUrl={previewImage || undefined}
            altText="Preview"
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Figure Preview</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full h-auto"
            />
          )}
        </DialogContent>
      </Dialog>

      <FigureList
        figures={figures || []}
        onRemove={onRemoveFigure}
        onUpdate={onUpdateFigure}
        onPreview={handlePreview}
      />
    </div>
  );
};