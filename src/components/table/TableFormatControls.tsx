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
    <div className="table-editor-controls">
      <div className="format-group">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFormatChange('align-left')}
          className={cn("format-button", activeFormats.align === 'left' && "active")}
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFormatChange('align-center')}
          className={cn("format-button", activeFormats.align === 'center' && "active")}
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFormatChange('align-right')}
          className={cn("format-button", activeFormats.align === 'right' && "active")}
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>
      
      <Separator orientation="vertical" className="h-6" />
      
      <div className="format-group">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFormatChange('bold')}
          className={cn("format-button", activeFormats.bold && "active")}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFormatChange('italic')}
          className={cn("format-button", activeFormats.italic && "active")}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onFormatChange('underline')}
          className={cn("format-button", activeFormats.underline && "active")}
        >
          <Underline className="h-4 w-4" />
        </Button>
      </div>

      {isHeader && (
        <>
          <Separator orientation="vertical" className="h-6" />
          <div className="format-group">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFormatChange('header-primary')}
              className={cn(
                "format-button",
                activeFormats.headerStyle === 'primary' && "active"
              )}
              title="Primary Header Style"
            >
              <Heading className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFormatChange('header-secondary')}
              className={cn(
                "format-button",
                activeFormats.headerStyle === 'secondary' && "active"
              )}
              title="Secondary Header Style"
            >
              <Type className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onFormatChange('header-none')}
              className={cn(
                "format-button",
                activeFormats.headerStyle === 'none' && "active"
              )}
              title="Remove Header Style"
            >
              <MinusSquare className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </div>
  );
};