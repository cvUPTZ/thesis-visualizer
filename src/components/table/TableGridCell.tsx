import React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface TableGridCellProps {
  value: string;
  onChange: (value: string) => void;
  isHeader?: boolean;
  format?: {
    align?: 'left' | 'center' | 'right';
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    headerStyle?: 'none' | 'primary' | 'secondary';
  };
}

export const TableGridCell = ({ 
  value, 
  onChange, 
  isHeader = false,
  format = {}
}: TableGridCellProps) => {
  const cellClasses = cn(
    "table-editor-cell",
    {
      'font-bold': format.bold || (isHeader && format.headerStyle !== 'none'),
      'font-normal': format.headerStyle === 'none',
      'italic': format.italic,
      'underline': format.underline,
      'text-left': format.align === 'left',
      'text-center': format.align === 'center',
      'text-right': format.align === 'right',
      'bg-gray-50': isHeader && format.headerStyle === 'primary',
      'bg-gray-100/50': isHeader && format.headerStyle === 'secondary',
      'text-gray-900': isHeader && format.headerStyle === 'primary',
      'text-gray-700': isHeader && format.headerStyle === 'secondary',
      'uppercase tracking-wide text-xs': isHeader && format.headerStyle === 'primary',
      'capitalize': isHeader && format.headerStyle === 'secondary',
    }
  );

  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cellClasses}
      placeholder={isHeader ? "Header" : "Cell content"}
    />
  );
};