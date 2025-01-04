import React, { useState } from 'react';
import { Table as TableType } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, X, Table2, Download, Upload, Plus, Trash } from 'lucide-react';
import { toast } from 'sonner';

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

  const handleAddColumn = (table: TableType) => {
    const newHeaders = [...table.headers, `Column ${table.headers.length + 1}`];
    const newRows = table.rows.map(row => [...row, '']);
    onUpdateTable({ ...table, headers: newHeaders, rows: newRows });
  };

  const handleRemoveRow = (table: TableType, rowIndex: number) => {
    if (table.rows.length > 1) {
      const newRows = table.rows.filter((_, index) => index !== rowIndex);
      onUpdateTable({ ...table, rows: newRows });
    }
  };

  const handleRemoveColumn = (table: TableType, colIndex: number) => {
    if (table.headers.length > 1) {
      const newHeaders = table.headers.filter((_, index) => index !== colIndex);
      const newRows = table.rows.map(row => row.filter((_, index) => index !== colIndex));
      onUpdateTable({ ...table, headers: newHeaders, rows: newRows });
    }
  };

  const exportToCsv = (table: TableType) => {
    const csvContent = [
      table.headers.join(','),
      ...table.rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `table_${table.number}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    
    toast({
      title: "Success",
      description: "Table exported to CSV successfully",
    });
  };

  const importCsv = async (file: File, tableId: string) => {
    const text = await file.text();
    const lines = text.split('\n');
    const headers = lines[0].split(',');
    const rows = lines.slice(1).map(line => line.split(','));

    const table = tables.find(t => t.id === tableId);
    if (table) {
      onUpdateTable({ ...table, headers, rows });
      toast({
        title: "Success",
        description: "CSV imported successfully",
      });
    }
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
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => exportToCsv(table)}
                  className="h-8 w-8 p-0"
                  title="Export to CSV"
                >
                  <Download className="w-4 h-4" />
                </Button>
                <label className="cursor-pointer">
                  <Input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) importCsv(file, table.id);
                    }}
                  />
                  <div className="h-8 w-8 flex items-center justify-center hover:bg-accent rounded-md">
                    <Upload className="w-4 h-4" />
                  </div>
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveTable(table.id)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
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
                        <TableCell key={index} className="bg-gray-50 relative">
                          <div className="flex items-center gap-2">
                            <Input
                              value={header}
                              onChange={(e) => {
                                const newHeaders = [...table.headers];
                                newHeaders[index] = e.target.value;
                                onUpdateTable({ ...table, headers: newHeaders });
                              }}
                              className="w-full bg-transparent border-0 focus:ring-0"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveColumn(table, index)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      ))}
                      <TableCell className="w-10 p-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAddColumn(table)}
                          className="h-full w-full"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </TableCell>
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
                        <TableCell className="w-10">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveRow(table, rowIndex)}
                            className="h-6 w-6 p-0"
                          >
                            <Trash className="w-3 h-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAddRow(table)}
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