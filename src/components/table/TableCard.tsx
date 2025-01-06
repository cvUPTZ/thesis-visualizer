import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table } from '@/types/thesis';
import { Pencil, Trash2 } from 'lucide-react';

interface TableCardProps {
  table: Table;
  onUpdate: (table: Table) => void;
  onRemove: (id: string) => void;
}

export const TableCard = ({ table, onUpdate, onRemove }: TableCardProps) => {
  return (
    <Card className="p-4 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="font-medium">Table {table.id}</h3>
          {table.caption && (
            <p className="text-sm text-muted-foreground">{table.caption}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onRemove(table.id)}
            className="h-8 w-8"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div 
        className="w-full overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: table.content }}
      />
    </Card>
  );
};