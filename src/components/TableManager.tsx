import React from 'react';
import { Table } from '@/types/thesis';
import { TableDialog } from './table/TableDialog';
import { TableCard } from './table/TableCard';

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
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-serif font-medium text-primary">Tables</h3>
        <TableDialog onAddTable={onAddTable} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tables.map((table) => (
          <TableCard
            key={table.id}
            table={table}
            onUpdate={onUpdateTable}
            onRemove={onRemoveTable}
          />
        ))}
      </div>
    </div>
  );
};