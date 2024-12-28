import React from 'react';
import { Table as TableType } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { PlusCircle, X } from 'lucide-react';

interface TableManagerProps {
  tables: TableType[];
  onAddTable: (table: TableType) => void;
  onRemoveTable: (id: string) => void;
  onUpdateTable: (table: TableType) => void;
}

export const TableManager = ({
  tables,
  onAddTable,
  onRemoveTable,
  onUpdateTable
}: TableManagerProps) => {
  const handleAddTable = () => {
    const newTable: TableType = {
      id: Date.now().toString(),
      caption: '',
      headers: ['Column 1', 'Column 2'],
      rows: [['', '']],
      number: tables.length + 1
    };
    onAddTable(newTable);
  };

  const handleAddRow = (table: TableType) => {
    const newRows = [...table.rows, new Array(table.headers.length).fill('')];
    onUpdateTable({ ...table, rows: newRows });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Tables</h3>
        <Button onClick={handleAddTable} variant="outline" size="sm">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Table
        </Button>
      </div>
      {tables.map((table) => (
        <div key={table.id} className="border rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-start">
            <span className="text-sm font-medium">Table {table.number}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveTable(table.id)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <Input
            placeholder="Caption"
            value={table.caption}
            onChange={(e) =>
              onUpdateTable({ ...table, caption: e.target.value })
            }
            className="mb-4"
          />
          <Table>
            <TableHeader>
              <TableRow>
                {table.headers.map((header, index) => (
                  <TableCell key={index}>
                    <Input
                      value={header}
                      onChange={(e) => {
                        const newHeaders = [...table.headers];
                        newHeaders[index] = e.target.value;
                        onUpdateTable({ ...table, headers: newHeaders });
                      }}
                      className="w-full"
                    />
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.rows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex}>
                      <Input
                        value={cell}
                        onChange={(e) => {
                          const newRows = [...table.rows];
                          newRows[rowIndex][cellIndex] = e.target.value;
                          onUpdateTable({ ...table, rows: newRows });
                        }}
                        className="w-full"
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button
            onClick={() => handleAddRow(table)}
            variant="outline"
            size="sm"
            className="mt-2"
          >
            Add Row
          </Button>
        </div>
      ))}
    </div>
  );
};