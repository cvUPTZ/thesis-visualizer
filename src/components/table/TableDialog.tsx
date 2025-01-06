import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TableDialogHeader } from './TableDialogHeader';
import { TableDialogGrid } from './TableDialogGrid';
import { TableDialogFooter } from './TableDialogFooter';
import { Table } from '@/types/thesis';

interface TableDialogProps {
  onAddTable: (table: Table) => void;
}

export const TableDialog = ({ onAddTable }: TableDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [caption, setCaption] = useState('');
  const [gridData, setGridData] = useState<Array<Array<{ value: string; format: any }>>>([
    [{ value: '', format: {} }, { value: '', format: {} }, { value: '', format: {} }],
    [{ value: '', format: {} }, { value: '', format: {} }, { value: '', format: {} }],
    [{ value: '', format: {} }, { value: '', format: {} }, { value: '', format: {} }]
  ]);
  const { toast } = useToast();

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

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...gridData];
    newData[rowIndex][colIndex] = {
      ...newData[rowIndex][colIndex],
      value
    };
    setGridData(newData);
  };

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
      case 'header-primary':
        currentFormat.headerStyle = 'primary';
        break;
      case 'header-secondary':
        currentFormat.headerStyle = 'secondary';
        break;
      case 'header-none':
        currentFormat.headerStyle = 'none';
        break;
    }

    newData[rowIndex][colIndex] = {
      ...newData[rowIndex][colIndex],
      format: currentFormat
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
        ${gridData.slice(1).map(row => `
          <tr>
            ${row.map(cell => `
              <td class="${getFormatClasses(cell.format)}">${cell.value}</td>
            `).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>`;
  };

  const getFormatClasses = (format: any) => {
    const classes = ['px-6 py-4 whitespace-nowrap text-sm text-gray-900'];
    if (format.align) classes.push(`text-${format.align}`);
    if (format.bold) classes.push('font-bold');
    if (format.italic) classes.push('italic');
    if (format.underline) classes.push('underline');
    if (format.headerStyle === 'primary') classes.push('bg-gray-100 font-bold uppercase tracking-wider');
    if (format.headerStyle === 'secondary') classes.push('bg-gray-50 font-semibold');
    return classes.join(' ');
  };

  const handleSave = () => {
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
      <DialogContent className="max-w-4xl">
        <TableDialogHeader />
        <div className="space-y-6 py-4">
          <TableDialogGrid
            gridData={gridData}
            onAddColumn={addColumn}
            onAddRow={addRow}
            onRemoveColumn={removeColumn}
            onRemoveRow={removeRow}
            onUpdateCell={updateCell}
            onFormatChange={handleFormatChange}
          />
          <TableDialogFooter
            caption={caption}
            onCaptionChange={setCaption}
            onCancel={() => setIsOpen(false)}
            onSave={handleSave}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};