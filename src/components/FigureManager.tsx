import React, { useState } from 'react';
import { Figure } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { PlusCircle, Image as ImageIcon } from 'lucide-react';
import { FigureController } from './editor/figures/FigureController';
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
  const [selectedFigure, setSelectedFigure] = useState<Figure | null>(null);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        
        const img = new Image();
        img.onload = () => {
          const newFigure: Figure = {
            id: Date.now().toString(),
            url: imageUrl,
            title: '',
            caption: '',
            alt_text: '',
            label: `Figure ${(figures?.length || 0) + 1}`,
            dimensions: {
              width: img.width,
              height: img.height
            },
            position: 'inline',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          onAddFigure(newFigure);
          setIsAddingFigure(false);
          
          toast({
            title: "Figure Added",
            description: "New figure has been added successfully.",
          });
        };
        img.src = imageUrl;
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
              onUpload={handleFileUpload}
              imageUrl={selectedFigure?.url}
              altText="Preview"
            />
          </motion.div>
        </DialogContent>
      </Dialog>

      <ScrollArea className="h-[600px] pr-4">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {figures?.map((figure) => (
              <motion.div
                key={figure.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <FigureController
                  figure={figure}
                  onUpdate={onUpdateFigure}
                  onDelete={onRemoveFigure}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </ScrollArea>
    </Card>
  );
};