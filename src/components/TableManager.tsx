import React from 'react';
import { Table } from '@/types/thesis';
import { TableDialog } from './table/TableDialog';
import { TableCard } from './table/TableCard';
import { ScrollArea } from './ui/scroll-area';

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
  console.log('Rendering TableManager with tables:', tables);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-serif font-medium text-primary">Tables</h3>
        <TableDialog onAddTable={onAddTable} />
      </div>
      <ScrollArea className="h-[600px]">
        <div className="grid grid-cols-1 gap-6">
          {tables.map((table) => (
            <TableCard
              key={table.id}
              table={table}
              onUpdate={onUpdateTable}
              onRemove={onRemoveTable}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};