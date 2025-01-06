import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Minus, Table2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TableFormatControls } from './TableFormatControls';
import { TableGridCell } from './TableGridCell';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table } from '@/types/thesis';

interface TableDialogProps {
  onAddTable: (table: Table) => void;
}

interface CellFormat {
  align?: 'left' | 'center' | 'right';
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

interface CellData {
  value: string;
  format: CellFormat;
}

export const TableDialog = ({ onAddTable }: TableDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [caption, setCaption] = useState('');
  const [gridData, setGridData] = useState<CellData[][]>([
    [{ value: '', format: {} }, { value: '', format: {} }, { value: '', format: {} }],
    [{ value: '', format: {} }, { value: '', format: {} }, { value: '', format: {} }],
    [{ value: '', format: {} }, { value: '', format: {} }, { value: '', format: {} }]
  ]);
  const { toast } = useToast();

  const handleFormatChange = (format: string, rowIndex: number, colIndex: number) => {
    const newData = [...gridData];
    const currentFormat = { ...newData[rowIndex][colIndex].format };

    switch (format) {
      case 'align-left':
      case 'align-center':
      case 'align-right':
        currentFormat.align = format.replace('align-', '') as 'left' | 'center' | 'right';
        break;
      case 'bold':
        currentFormat.bold = !currentFormat.bold;
        break;
      case 'italic':
        currentFormat.italic = !currentFormat.italic;
        break;
      case 'underline':
        currentFormat.underline = !currentFormat.underline;
        break;
    }

    newData[rowIndex][colIndex] = {
      ...newData[rowIndex][colIndex],
      format: currentFormat
    };
    setGridData(newData);
  };

  const addRow = () => {
    setGridData([...gridData, Array(gridData[0].length).fill({ value: '', format: {} })]);
  };

  const removeRow = (index: number) => {
    if (gridData.length > 1) {
      const newData = [...gridData];
      newData.splice(index, 1);
      setGridData(newData);
    }
  };

  const addColumn = () => {
    setGridData(gridData.map(row => [...row, { value: '', format: {} }]));
  };

  const removeColumn = (index: number) => {
    if (gridData[0].length > 1) {
      setGridData(gridData.map(row => {
        const newRow = [...row];
        newRow.splice(index, 1);
        return newRow;
      }));
    }
  };

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...gridData];
    newData[rowIndex][colIndex] = {
      ...newData[rowIndex][colIndex],
      value
    };
    setGridData(newData);
  };

  const generateTableHtml = () => {
    return `<table class="min-w-full divide-y divide-gray-200">
      <thead>
        <tr>
          ${gridData[0].map((cell, i) => `
            <th class="${getFormatClasses(cell.format)}">${cell.value}</th>
          `).join('')}
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        ${gridData.slice(1).map((row, rowIndex) => `
          <tr>
            ${row.map((cell, cellIndex) => `
              <td class="${getFormatClasses(cell.format)}">${cell.value}</td>
            `).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>`;
  };

  const getFormatClasses = (format: CellFormat) => {
    const classes = ['px-6 py-4 whitespace-nowrap text-sm text-gray-900'];
    if (format.align) classes.push(`text-${format.align}`);
    if (format.bold) classes.push('font-bold');
    if (format.italic) classes.push('italic');
    if (format.underline) classes.push('underline');
    return classes.join(' ');
  };

  const handleAddTable = () => {
    try {
      const tableContent = generateTableHtml();
      const newTable: Table = {
        id: Date.now().toString(),
        title: 'New Table',
        content: tableContent,
        caption: caption
      };

      onAddTable(newTable);
      setIsOpen(false);
      setCaption('');
      setGridData([
        [{ value: '', format: {} }, { value: '', format: {} }, { value: '', format: {} }],
        [{ value: '', format: {} }, { value: '', format: {} }, { value: '', format: {} }],
        [{ value: '', format: {} }, { value: '', format: {} }, { value: '', format: {} }]
      ]);
      
      toast({
        title: "Table created successfully",
        description: "Your table has been added to the document",
      });
    } catch (error) {
      console.error('Error creating table:', error);
      toast({
        title: "Error creating table",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-white shadow-md hover:bg-gray-50">
          <Table2 className="w-4 h-4" />
          Add Table
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Table2 className="w-5 h-5" />
            Add New Table
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Caption</label>
            <Input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Enter table caption..."
              className="mt-1"
            />
          </div>
          <div className="relative overflow-hidden rounded-lg border border-gray-200 shadow-sm">
            <div className="excel-grid">
              <div className="grid-controls flex justify-end gap-2 p-2 bg-gray-50 border-b">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addColumn}
                  className="flex items-center gap-1 bg-white"
                >
                  <Plus className="h-3 w-3" /> Column
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addRow}
                  className="flex items-center gap-1 bg-white"
                >
                  <Plus className="h-3 w-3" /> Row
                </Button>
              </div>
              <div className="grid-content p-4">
                <div 
                  className="grid gap-2" 
                  style={{ 
                    gridTemplateColumns: `repeat(${gridData[0].length + 1}, minmax(min-content, 1fr))` 
                  }}
                >
                  {/* Column headers and remove buttons */}
                  <div></div>
                  {gridData[0].map((_, colIndex) => (
                    <div key={`col-${colIndex}`} className="flex justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeColumn(colIndex)}
                        className="h-6 w-6 p-0"
                        disabled={gridData[0].length <= 1}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                  
                  {/* Grid cells and row remove buttons */}
                  {gridData.map((row, rowIndex) => (
                    <React.Fragment key={`row-${rowIndex}`}>
                      <div className="flex items-center justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeRow(rowIndex)}
                          className="h-6 w-6 p-0"
                          disabled={gridData.length <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                      </div>
                      {row.map((cell, colIndex) => (
                        <div key={`cell-${rowIndex}-${colIndex}`} className="relative">
                          <TableFormatControls
                            onFormatChange={(format) => handleFormatChange(format, rowIndex, colIndex)}
                            isHeader={rowIndex === 0}
                          />
                          <TableGridCell
                            value={cell.value}
                            onChange={(value) => updateCell(rowIndex, colIndex, value)}
                            isHeader={rowIndex === 0}
                            align={cell.format.align}
                            format={cell.format}
                          />
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTable}>
              Create Table
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};