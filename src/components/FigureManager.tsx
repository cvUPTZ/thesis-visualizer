import React, { useState } from 'react';
import { Figure } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { PlusCircle, Upload } from 'lucide-react';
import { FigureList } from './editor/managers/FigureList';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from './ui/input';
import { Label } from './ui/label';

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
  const [isAddingFigure, setIsAddingFigure] = useState(false);
  const [newFigure, setNewFigure] = useState<Partial<Figure>>({
    caption: '',
    altText: '',
  });
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.onload = () => {
        setNewFigure(prev => ({
          ...prev,
          imageUrl: e.target?.result as string,
          dimensions: {
            width: img.width,
            height: img.height
          }
        }));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleAddFigure = () => {
    if (!newFigure.imageUrl) {
      toast({
        title: "Missing image",
        description: "Please upload an image first",
        variant: "destructive"
      });
      return;
    }

    const figure: Figure = {
      id: Date.now().toString(),
      caption: newFigure.caption || '',
      imageUrl: newFigure.imageUrl,
      altText: newFigure.altText || '',
      number: figures.length + 1,
      dimensions: newFigure.dimensions || { width: 0, height: 0 }
    };

    onAddFigure(figure);
    setNewFigure({ caption: '', altText: '' });
    setIsAddingFigure(false);
    
    toast({
      title: "Success",
      description: "Figure added successfully",
    });
  };

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

      <FigureList
        figures={figures}
        onRemove={onRemoveFigure}
        onUpdate={onUpdateFigure}
        onPreview={setSelectedImage}
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
                className="max-h-[70vh] object-contain"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddingFigure} onOpenChange={setIsAddingFigure}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Figure</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Image</Label>
              <div className="border-2 border-dashed rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="figure-upload"
                />
                <label 
                  htmlFor="figure-upload" 
                  className="flex flex-col items-center gap-2 cursor-pointer"
                >
                  {newFigure.imageUrl ? (
                    <img 
                      src={newFigure.imageUrl} 
                      alt="Preview" 
                      className="max-h-40 object-contain"
                    />
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Click to upload or drag and drop
                      </span>
                    </>
                  )}
                </label>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Caption</Label>
              <Input
                value={newFigure.caption || ''}
                onChange={(e) => setNewFigure(prev => ({ ...prev, caption: e.target.value }))}
                placeholder="Enter figure caption"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Alt Text</Label>
              <Input
                value={newFigure.altText || ''}
                onChange={(e) => setNewFigure(prev => ({ ...prev, altText: e.target.value }))}
                placeholder="Enter alt text for accessibility"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingFigure(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddFigure}>
              Add Figure
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};