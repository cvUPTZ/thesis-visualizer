import React from 'react';
import { Table as TableType } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, X, Table2 } from 'lucide-react';

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-serif font-medium text-primary">Tables</h3>
        <Button onClick={handleAddTable} variant="outline" size="sm" className="gap-2">
          <PlusCircle className="w-4 h-4" />
          Add Table
        </Button>
      </div>
      <div className="space-y-6">
        {tables.map((table) => (
          <Card key={table.id} className="border-2 border-editor-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Table2 className="w-4 h-4 inline mr-2" />
                Table {table.number}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveTable(table.id)}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Caption"
                value={table.caption}
                onChange={(e) =>
                  onUpdateTable({ ...table, caption: e.target.value })
                }
                className="mb-4"
              />
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {table.headers.map((header, index) => (
                        <TableCell key={index} className="bg-gray-50">
                          <Input
                            value={header}
                            onChange={(e) => {
                              const newHeaders = [...table.headers];
                              newHeaders[index] = e.target.value;
                              onUpdateTable({ ...table, headers: newHeaders });
                            }}
                            className="w-full bg-transparent border-0 focus:ring-0"
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
                              className="w-full bg-transparent border-0 focus:ring-0"
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Button
                onClick={() => handleAddRow(table)}
                variant="outline"
                size="sm"
                className="w-full mt-2"
              >
                Add Row
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};