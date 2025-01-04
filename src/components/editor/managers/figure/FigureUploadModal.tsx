import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FigureUploadModalProps {
  open: boolean;
  onClose: () => void;
  onUpload: (figure: { imageUrl: string; caption: string; altText: string; dimensions: { width: number; height: number } }) => void;
}

export const FigureUploadModal = ({ open, onClose, onUpload }: FigureUploadModalProps) => {
  const [imageData, setImageData] = React.useState<{ url: string; dimensions: { width: number; height: number } } | null>(null);
  const [caption, setCaption] = React.useState('');
  const [altText, setAltText] = React.useState('');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            setImageData({
              url: e.target?.result as string,
              dimensions: {
                width: img.width,
                height: img.height
              }
            });
          };
          img.src = e.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    }
  });

  const handleSubmit = () => {
    if (imageData) {
      onUpload({
        imageUrl: imageData.url,
        caption,
        altText,
        dimensions: imageData.dimensions
      });
      setImageData(null);
      setCaption('');
      setAltText('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Add New Figure
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div {...getRootProps()} className={cn(
            "border-2 border-dashed rounded-lg p-8 transition-colors cursor-pointer text-center",
            isDragActive ? "border-primary bg-primary/5" : "border-muted hover:border-primary/50",
            imageData && "border-success"
          )}>
            <input {...getInputProps()} />
            {imageData ? (
              <div className="space-y-4">
                <img 
                  src={imageData.url} 
                  alt="Preview" 
                  className="max-h-48 mx-auto object-contain rounded-md"
                />
                <p className="text-sm text-muted-foreground">
                  Image uploaded successfully! Click or drag to replace.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">
                    Drop your image here or click to browse
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports PNG, JPG, JPEG, GIF up to 10MB
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="caption">Caption</Label>
              <Input
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Enter a descriptive caption for your figure"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="altText">Alt Text</Label>
              <Input
                id="altText"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                placeholder="Describe the image for accessibility"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit}
            disabled={!imageData}
          >
            Add Figure
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};