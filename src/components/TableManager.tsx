import React from 'react';
import { Table } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';

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

  const handleCaptionChange = (tableId: string, newCaption: string) => {
    const table = tables.find(t => t.id === tableId);
    if (table) {
      onUpdateTable({
        ...table,
        caption: newCaption
      });
    }
  };

  const handleContentChange = (tableId: string, newContent: string) => {
    const table = tables.find(t => t.id === tableId);
    if (table) {
      onUpdateTable({
        ...table,
        content: newContent
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
        >
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
                onChange={(e) => handleCaptionChange(table.id, e.target.value)}
                className="max-w-md"
                placeholder="Table caption"
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onRemoveTable(table.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4">
              <textarea
                value={table.content || ''}
                onChange={(e) => handleContentChange(table.id, e.target.value)}
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