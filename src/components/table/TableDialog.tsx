import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Plus, Minus, Table2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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

export const TableDialog = ({ onAddTable }: TableDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [caption, setCaption] = useState('');
  const [gridData, setGridData] = useState([['', '', ''], ['', '', ''], ['', '', '']]);
  const { toast } = useToast();

  const addRow = () => {
    console.log('Adding new row to grid');
    setGridData([...gridData, Array(gridData[0].length).fill('')]);
  };

  const removeRow = (index: number) => {
    console.log('Removing row at index:', index);
    if (gridData.length > 1) {
      const newData = [...gridData];
      newData.splice(index, 1);
      setGridData(newData);
    } else {
      toast({
        title: "Cannot remove last row",
        description: "Table must have at least one row",
        variant: "destructive",
      });
    }
  };

  const addColumn = () => {
    console.log('Adding new column to grid');
    setGridData(gridData.map(row => [...row, '']));
  };

  const removeColumn = (index: number) => {
    console.log('Removing column at index:', index);
    if (gridData[0].length > 1) {
      setGridData(gridData.map(row => {
        const newRow = [...row];
        newRow.splice(index, 1);
        return newRow;
      }));
    } else {
      toast({
        title: "Cannot remove last column",
        description: "Table must have at least one column",
        variant: "destructive",
      });
    }
  };

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    console.log('Updating cell:', { rowIndex, colIndex, value });
    const newData = [...gridData];
    newData[rowIndex][colIndex] = value;
    setGridData(newData);
  };

  const handleAddTable = () => {
    try {
      console.log('Creating new table with data:', { gridData, caption });
      
      const tableContent = `<table class="min-w-full divide-y divide-gray-200">
        <tbody class="bg-white divide-y divide-gray-200">
          ${gridData.map((row, rowIndex) => `
            <tr key="row-${rowIndex}">
              ${row.map((cell, cellIndex) => `<td key="cell-${rowIndex}-${cellIndex}" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${cell}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>`;

      const newTable: Table = {
        id: Date.now().toString(),
        title: 'New Table',
        content: tableContent,
        caption: caption
      };

      onAddTable(newTable);
      setIsOpen(false);
      setCaption('');
      setGridData([['', '', ''], ['', '', ''], ['', '', '']]);
      
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
            <div className="excel-grid bg-white">
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
                        className="h-6 w-6 p-0 hover:bg-red-50"
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
                          className="h-6 w-6 p-0 hover:bg-red-50"
                          disabled={gridData.length <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                      </div>
                      {row.map((cell, colIndex) => (
                        <Input
                          key={`cell-${rowIndex}-${colIndex}`}
                          value={cell}
                          onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                          className="h-8 text-sm focus:ring-2 focus:ring-primary/20"
                        />
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