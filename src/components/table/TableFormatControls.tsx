import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  Bold, 
  Italic,
  Underline,
  Heading,
  Type,
  ArrowUpDown,
  MinusSquare
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface TableFormatControlsProps {
  onFormatChange: (format: string) => void;
  isHeader?: boolean;
  activeFormats?: {
    align?: 'left' | 'center' | 'right';
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    headerStyle?: 'none' | 'primary' | 'secondary';
  };
}

export const TableFormatControls = ({ 
  onFormatChange, 
  isHeader = false,
  activeFormats = {}
}: TableFormatControlsProps) => {
  return (
    <div className="flex items-center gap-2 p-2 bg-white/50 backdrop-blur-sm border-b border-gray-200">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFormatChange('align-left')}
          className={cn("h-8 w-8 p-0", activeFormats.align === 'left' && "bg-gray-100")}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFormatChange('align-center')}
          className={cn("h-8 w-8 p-0", activeFormats.align === 'center' && "bg-gray-100")}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFormatChange('align-right')}
          className={cn("h-8 w-8 p-0", activeFormats.align === 'right' && "bg-gray-100")}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>
      
      <Separator orientation="vertical" className="h-6" />
      
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFormatChange('bold')}
          className={cn("h-8 w-8 p-0", activeFormats.bold && "bg-gray-100")}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFormatChange('italic')}
          className={cn("h-8 w-8 p-0", activeFormats.italic && "bg-gray-100")}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFormatChange('underline')}
          className={cn("h-8 w-8 p-0", activeFormats.underline && "bg-gray-100")}
        >
          <Underline className="h-4 w-4" />
        </Button>
      </div>

      {isHeader && (
        <>
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFormatChange('header-primary')}
              className={cn(
                "h-8 px-3 flex items-center gap-1",
                activeFormats.headerStyle === 'primary' && "bg-gray-100"
              )}
            >
              <Heading className="h-4 w-4" />
              <span className="text-sm">Primary</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFormatChange('header-secondary')}
              className={cn(
                "h-8 px-3 flex items-center gap-1",
                activeFormats.headerStyle === 'secondary' && "bg-gray-100"
              )}
            >
              <Type className="h-4 w-4" />
              <span className="text-sm">Secondary</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFormatChange('header-sort')}
              className="h-8 w-8 p-0"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFormatChange('header-none')}
              className={cn(
                "h-8 w-8 p-0",
                activeFormats.headerStyle === 'none' && "bg-gray-100"
              )}
            >
              <MinusSquare className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};