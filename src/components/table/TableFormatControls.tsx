import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Bold, 
  Italic,
  Underline,
  Heading
} from 'lucide-react';

interface TableFormatControlsProps {
  onFormatChange: (format: string) => void;
  isHeader?: boolean;
}

export const TableFormatControls = ({ onFormatChange, isHeader = false }: TableFormatControlsProps) => {
  return (
    <div className="flex items-center gap-2 p-2 bg-white border-b border-gray-200">
      <div className="flex items-center gap-1 border-r pr-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFormatChange('align-left')}
          className="h-8 w-8 p-0"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFormatChange('align-center')}
          className="h-8 w-8 p-0"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFormatChange('align-right')}
          className="h-8 w-8 p-0"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center gap-1 border-r pr-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFormatChange('bold')}
          className="h-8 w-8 p-0"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFormatChange('italic')}
          className="h-8 w-8 p-0"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFormatChange('underline')}
          className="h-8 w-8 p-0"
        >
          <Underline className="h-4 w-4" />
        </Button>
      </div>

      {isHeader && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFormatChange('header')}
          className="h-8 px-3 flex items-center gap-1"
        >
          <Heading className="h-4 w-4" />
          <span className="text-sm">Header</span>
        </Button>
      )}
    </div>
  );
};