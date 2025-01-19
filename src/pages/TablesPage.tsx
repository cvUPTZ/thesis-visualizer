import React from 'react';
import { TableManager } from '@/components/TableManager';
import { Table } from '@/types/thesis';

const TablesPage = () => {
  const handleAddTable = (table: Table) => {
    console.log('Adding table:', table);
  };

  const handleRemoveTable = (id: string) => {
    console.log('Removing table:', id);
  };

  const handleUpdateTable = (table: Table) => {
    console.log('Updating table:', table);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Tables</h1>
      <TableManager
        tables={[]}
        onAddTable={handleAddTable}
        onRemoveTable={handleRemoveTable}
        onUpdateTable={handleUpdateTable}
      />
    </div>
  );
};

export default TablesPage;