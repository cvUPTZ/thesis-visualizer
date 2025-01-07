import React from 'react';
import { Table } from '@/types/thesis';
import { TableDialog } from './table/TableDialog';
import { TableCard } from './table/TableCard';
import { ScrollArea } from './ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './ui/card';
import { Table as TableIcon } from 'lucide-react';

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
    <Card className="p-6 space-y-6 bg-white/50 backdrop-blur-sm border-2 border-primary/10 shadow-xl rounded-xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-between items-center"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <TableIcon className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-serif font-medium text-primary">Tables</h3>
        </div>
        <TableDialog onAddTable={onAddTable} />
      </motion.div>

      <ScrollArea className="h-[600px] pr-4">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 gap-6"
          >
            {tables.map((table, index) => (
              <motion.div
                key={table.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
              >
                <TableCard
                  table={table}
                  onUpdate={onUpdateTable}
                  onRemove={onRemoveTable}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </ScrollArea>
    </Card>
  );
};