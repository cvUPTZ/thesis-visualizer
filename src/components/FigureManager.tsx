import React, { useState } from 'react';
import { Figure } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { PlusCircle, Image as ImageIcon } from 'lucide-react';
import { FigureList } from './editor/managers/FigureList';
import { FigureUpload } from './editor/managers/FigureUpload';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';

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

  const handleFileUpload = async (
    file: File,
    position?: string,
    customWidth?: number,
    customHeight?: number
  ) => {
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        
        const img = new Image();
        img.onload = () => {
          const newFigure: Figure = {
            id: Date.now().toString(),
            imageUrl,
            title: '',
            caption: '',
            altText: '',
            number: (figures?.length || 0) + 1,
            dimensions: {
              width: img.width,
              height: img.height
            },
            position,
            customWidth,
            customHeight,
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
    <Card className="p-6 space-y-6 bg-white/50 backdrop-blur-sm border-2 border-primary/10 shadow-xl rounded-xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-between items-center"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <ImageIcon className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-serif font-medium text-primary">Figures</h3>
        </div>
        <Button
          onClick={() => setIsAddingFigure(true)} 
          variant="outline" 
          size="sm"
          className="gap-2 hover:bg-primary/10 transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Add Figure
        </Button>
      </motion.div>

      <Dialog open={isAddingFigure} onOpenChange={setIsAddingFigure}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Figure</DialogTitle>
          </DialogHeader>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <FigureUpload
              onUpload={(file, position, customWidth, customHeight) =>
                handleFileUpload(file, position, customWidth, customHeight)
              }
              imageUrl={previewImage || undefined}
              altText="Preview"
            />
          </motion.div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Figure Preview</DialogTitle>
          </DialogHeader>
          <AnimatePresence mode="wait">
            {selectedImage && (
              <motion.img
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                src={selectedImage}
                alt="Preview"
                className="w-full h-auto rounded-lg shadow-lg"
              />
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      <ScrollArea className="h-[600px] pr-4">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <FigureList
              figures={figures || []}
              onRemove={onRemoveFigure}
              onUpdate={onUpdateFigure}
              onPreview={handlePreview}
            />
          </motion.div>
        </AnimatePresence>
      </ScrollArea>
    </Card>
  );
};
