import React from 'react';
import { Table } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, PlusCircle } from 'lucide-react';

interface TableManagerProps {
  tables: Table[];
  onUpdateTable: (table: Table) => void;
  onRemoveTable: (id: string) => void;
  onAddTable: (table: Table) => void;
}

export const TableManager: React.FC<TableManagerProps> = ({
  tables,
  onUpdateTable,
  onRemoveTable,
  onAddTable,
}) => {
  const handleAddTable = () => {
    const newTable: Table = {
      id: Date.now().toString(),
      caption: '',
      content: '',
      title: ''
    };
    onAddTable(newTable);
  };

  const handleInputChange = (tableId: string, field: keyof Table, value: string) => {
    console.log('Updating table:', { tableId, field, value });
    const table = tables.find(t => t.id === tableId);
    if (table) {
      onUpdateTable({
        ...table,
        [field]: value
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Tables</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddTable}
          className="flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          Add Table
        </Button>
      </div>
      {tables.map((table) => (
        <Card key={table.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <Input
                type="text"
                value={table.caption || ''}
                onChange={(e) => handleInputChange(table.id, 'caption', e.target.value)}
                className="max-w-md"
                placeholder="Table caption"
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onRemoveTable(table.id)}
              >
                <Trash2 className="h-4 h-4" />
              </Button>
            </div>
            <div className="mt-4">
              <textarea
                value={table.content || ''}
                onChange={(e) => handleInputChange(table.id, 'content', e.target.value)}
                className="w-full min-h-[200px] p-2 border rounded"
                placeholder="Enter table content (CSV format or markdown table)"
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};