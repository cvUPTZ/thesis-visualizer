import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface FigureUploadProps {
  onUpload: (file: File) => void;
  imageUrl?: string;
  altText?: string;
}

export const FigureUpload = ({ onUpload, imageUrl, altText }: FigureUploadProps) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        onUpload(acceptedFiles[0]);
      }
    }
  });

  return (
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
  );
};