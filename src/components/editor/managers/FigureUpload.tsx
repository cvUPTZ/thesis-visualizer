import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';

interface FigureUploadProps {
  onUpload: (
    file: File, 
    position?: 'left' | 'center' | 'right',
    customWidth?: number,
    customHeight?: number,
    border?: {
      style: 'single' | 'double' | 'thick' | 'none';
      size: number;
      color: string;
    }
  ) => void;
  imageUrl?: string;
  altText?: string;
}

export const FigureUpload = ({ onUpload, imageUrl, altText }: FigureUploadProps) => {
  const [position, setPosition] = useState<'left' | 'center' | 'right'>('center');
  const [customWidth, setCustomWidth] = useState<number>();
  const [customHeight, setCustomHeight] = useState<number>();
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [border, setBorder] = useState({
    style: 'none' as const,
    size: 1,
    color: '#000000'
  });
  const [originalDimensions, setOriginalDimensions] = useState<{width: number, height: number}>();

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const img = new Image();
        img.onload = () => {
          setOriginalDimensions({ width: img.width, height: img.height });
          setCustomWidth(img.width);
          setCustomHeight(img.height);
        };
        img.src = URL.createObjectURL(file);
        onUpload(file, position, customWidth, customHeight, border);
      }
    },
    [onUpload, position, customWidth, customHeight, border]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    multiple: false,
    onDrop: handleDrop,
  });

  const handleWidthChange = (width: number) => {
    setCustomWidth(width);
    if (maintainAspectRatio && originalDimensions) {
      const ratio = originalDimensions.height / originalDimensions.width;
      setCustomHeight(Math.round(width * ratio));
    }
  };

  const handleHeightChange = (height: number) => {
    setCustomHeight(height);
    if (maintainAspectRatio && originalDimensions) {
      const ratio = originalDimensions.width / originalDimensions.height;
      setCustomWidth(Math.round(height * ratio));
    }
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className="relative aspect-video mb-4 bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 border-dashed border-gray-300 hover:border-primary transition-colors"
      >
        <input {...getInputProps()} />
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={altText}
            className="object-contain w-full h-full"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <Upload className="w-8 h-8 text-gray-400" />
            <p className="text-sm text-gray-500 mt-2">Drop image here or click to upload</p>
          </div>
        )}
      </div>

      <Card className="p-4 space-y-4">
        <div>
          <Label htmlFor="position">Position</Label>
          <Select onValueChange={(value: 'left' | 'center' | 'right') => setPosition(value)} defaultValue={position}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Center" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="left">Left</SelectItem>
              <SelectItem value="center">Center</SelectItem>
              <SelectItem value="right">Right</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Maintain Aspect Ratio</Label>
            <Switch 
              checked={maintainAspectRatio}
              onCheckedChange={setMaintainAspectRatio}
            />
          </div>

          <div className="space-y-2">
            <Label>Width (px)</Label>
            <Input
              type="number"
              value={customWidth}
              onChange={(e) => handleWidthChange(Number(e.target.value))}
              min={1}
            />
          </div>

          <div className="space-y-2">
            <Label>Height (px)</Label>
            <Input
              type="number"
              value={customHeight}
              onChange={(e) => handleHeightChange(Number(e.target.value))}
              min={1}
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label>Border Style</Label>
          <Select 
            onValueChange={(value: 'none' | 'single' | 'double' | 'thick') => 
              setBorder(prev => ({ ...prev, style: value }))}
            defaultValue={border.style}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="None" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="double">Double</SelectItem>
              <SelectItem value="thick">Thick</SelectItem>
            </SelectContent>
          </Select>

          {border.style !== 'none' && (
            <>
              <div className="space-y-2">
                <Label>Border Size (px)</Label>
                <Slider
                  value={[border.size]}
                  onValueChange={([value]) => setBorder(prev => ({ ...prev, size: value }))}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <Label>Border Color</Label>
                <Input
                  type="color"
                  value={border.color}
                  onChange={(e) => setBorder(prev => ({ ...prev, color: e.target.value }))}
                  className="h-10"
                />
              </div>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};