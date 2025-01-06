import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';
import { TableFormatControls } from './TableFormatControls';
import { TableGridCell } from './TableGridCell';

interface TableDialogGridProps {
  gridData: Array<Array<{ value: string; format: any }>>;
  onAddColumn: () => void;
  onAddRow: () => void;
  onRemoveColumn: (index: number) => void;
  onRemoveRow: (index: number) => void;
  onUpdateCell: (rowIndex: number, colIndex: number, value: string) => void;
  onFormatChange: (format: string, rowIndex: number, colIndex: number) => void;
}

export const TableDialogGrid = ({
  gridData,
  onAddColumn,
  onAddRow,
  onRemoveColumn,
  onRemoveRow,
  onUpdateCell,
  onFormatChange,
}: TableDialogGridProps) => {
  return (
    <div className="relative overflow-hidden rounded-lg border border-gray-200 shadow-sm bg-white">
      <div className="grid-controls flex justify-end gap-2 p-2 bg-gray-50/80 backdrop-blur-sm border-b">
        <Button
          variant="outline"
          size="sm"
          onClick={onAddColumn}
          className="flex items-center gap-1 bg-white hover:bg-primary/5"
        >
          <Plus className="h-3 w-3" /> Column
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onAddRow}
          className="flex items-center gap-1 bg-white hover:bg-primary/5"
        >
          <Plus className="h-3 w-3" /> Row
        </Button>
      </div>
      <div className="grid-content p-4 overflow-x-auto">
        <div 
          className="grid gap-2" 
          style={{ 
            gridTemplateColumns: `repeat(${gridData[0].length + 1}, minmax(min-content, 1fr))` 
          }}
        >
          <div></div>
          {gridData[0].map((_, colIndex) => (
            <div key={`col-${colIndex}`} className="flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveColumn(colIndex)}
                className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                disabled={gridData[0].length <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
            </div>
          ))}
          
          {gridData.map((row, rowIndex) => (
            <React.Fragment key={`row-${rowIndex}`}>
              <div className="flex items-center justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveRow(rowIndex)}
                  className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                  disabled={gridData.length <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
              </div>
              {row.map((cell, colIndex) => (
                <div key={`cell-${rowIndex}-${colIndex}`} className="relative">
                  <TableFormatControls
                    onFormatChange={(format) => onFormatChange(format, rowIndex, colIndex)}
                    isHeader={rowIndex === 0}
                    activeFormats={cell.format}
                  />
                  <TableGridCell
                    value={cell.value}
                    onChange={(value) => onUpdateCell(rowIndex, colIndex, value)}
                    isHeader={rowIndex === 0}
                    format={cell.format}
                  />
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};