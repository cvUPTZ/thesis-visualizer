import React, { useState } from 'react';
import { Table } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Edit2, Eye, Plus, Minus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface TableCardProps {
  table: Table;
  onUpdate: (table: Table) => void;
  onRemove: (id: string) => void;
}

export const TableCard = ({ table, onUpdate, onRemove }: TableCardProps) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedCaption, setEditedCaption] = React.useState(table.caption || '');
  const [gridData, setGridData] = useState(() => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(table.content, 'text/html');
      const rows: string[][] = [];
      doc.querySelectorAll('tr').forEach(tr => {
        const rowData: string[] = [];
        tr.querySelectorAll('td').forEach(td => {
          rowData.push(td.textContent || '');
        });
        rows.push(rowData);
      });
      return rows.length > 0 ? rows : [['', '', ''], ['', '', ''], ['', '', '']];
    } catch (e) {
      console.error('Error parsing table content:', e);
      return [['', '', ''], ['', '', ''], ['', '', '']];
    }
  });

  const addRow = () => {
    setGridData([...gridData, Array(gridData[0].length).fill('')]);
  };

  const removeRow = (index: number) => {
    if (gridData.length > 1) {
      const newData = [...gridData];
      newData.splice(index, 1);
      setGridData(newData);
    }
  };

  const addColumn = () => {
    setGridData(gridData.map(row => [...row, '']));
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
    newData[rowIndex][colIndex] = value;
    setGridData(newData);
  };

  const handleSave = () => {
    const tableContent = `<table class="min-w-full divide-y divide-gray-200">
      <tbody class="bg-white divide-y divide-gray-200">
        ${gridData.map(row => `
          <tr>
            ${row.map(cell => `<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${cell}</td>`).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>`;

    onUpdate({
      ...table,
      caption: editedCaption,
      content: tableContent,
    });
    setIsEditing(false);
  };

  return (
    <Card className="group relative border-2 border-editor-border transition-all duration-200 hover:shadow-lg bg-card">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Table {table.id}
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="h-8 w-8 p-0"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
              >
                <Eye className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Table Preview</DialogTitle>
              </DialogHeader>
              <div className="prose max-w-none dark:prose-invert">
                <div dangerouslySetInnerHTML={{ __html: table.content }} />
              </div>
            </DialogContent>
          </Dialog>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRemove(table.id)}
            className="h-8 w-8 p-0"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4 animate-fade-in">
            <div>
              <label className="text-sm font-medium">Caption</label>
              <Input
                value={editedCaption}
                onChange={(e) => setEditedCaption(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg border border-border">
              <div className="excel-grid">
                <div className="grid-controls flex justify-end gap-2 p-2 bg-muted">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addColumn}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" /> Column
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addRow()}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" /> Row
                  </Button>
                </div>
                <div className="grid-content p-4">
                  <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${gridData[0].length + 1}, minmax(min-content, 1fr))` }}>
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
                          <Input
                            key={`cell-${rowIndex}-${colIndex}`}
                            value={cell}
                            onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                            className="h-8 text-sm"
                          />
                        ))}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm font-medium">Caption:</p>
            <p className="text-sm">{table.caption}</p>
            <p className="text-sm font-medium mt-4">Preview:</p>
            <div className="prose max-w-none dark:prose-invert overflow-x-auto">
              <div dangerouslySetInnerHTML={{ __html: table.content }} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};