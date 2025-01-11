import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FigureUploadProps {
  onUpload: (file: File, position?: 'left' | 'center' | 'right', customWidth?: number, customHeight?: number) => void;
  imageUrl?: string;
  altText?: string;
}

export const FigureUpload = ({ onUpload, imageUrl, altText }: FigureUploadProps) => {
  const [position, setPosition] = useState<'left' | 'center' | 'right'>('center');
  const [customWidth, setCustomWidth] = useState<number | undefined>();
  const [customHeight, setCustomHeight] = useState<number | undefined>();

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        onUpload(file, position, customWidth, customHeight);
      }
    },
    [onUpload, position, customWidth, customHeight]
  );

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    multiple: false,
    onDrop: handleDrop,
  });

  return (
    <div>
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
      <div className="grid grid-cols-2 gap-4">
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
        <div>
          <Label htmlFor="width">Width (px)</Label>
          <Input
            type="number"
            id="width"
            placeholder="Auto"
            value={customWidth}
            onChange={(e) => setCustomWidth(Number(e.target.value))}
          />
        </div>
        <div>
          <Label htmlFor="height">Height (px)</Label>
          <Input
            type="number"
            id="height"
            placeholder="Auto"
            value={customHeight}
            onChange={(e) => setCustomHeight(Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};
