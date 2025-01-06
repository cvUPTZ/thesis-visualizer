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
      'font-bold': format.bold || isHeader,
      'italic': format.italic,
      'underline': format.underline,
      'text-left': align === 'left',
      'text-center': align === 'center',
      'text-right': align === 'right',
      'bg-gray-50 font-semibold': isHeader,
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