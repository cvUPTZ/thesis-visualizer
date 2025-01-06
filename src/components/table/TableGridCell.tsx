import React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface TableGridCellProps {
  value: string;
  onChange: (value: string) => void;
  isHeader?: boolean;
  align?: 'left' | 'center' | 'right';
  format?: {
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
  align = 'left',
  format = {}
}: TableGridCellProps) => {
  const cellClasses = cn(
    "h-8 text-sm transition-all duration-150 ease-in-out",
    "focus:ring-2 focus:ring-primary/20",
    "hover:bg-blue-50/30 focus:bg-blue-50/50",
    "border border-gray-200",
    {
      'font-bold': format.bold || (isHeader && format.headerStyle !== 'none'),
      'font-normal': format.headerStyle === 'none',
      'font-style-italic': format.italic,
      'underline': format.underline,
      'text-left': align === 'left',
      'text-center': align === 'center',
      'text-right': align === 'right',
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
    />
  );
};