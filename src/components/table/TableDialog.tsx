import React from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table } from '@/types/thesis';

interface TableDialogProps {
  onAddTable: (table: Table) => void;
}

export const TableDialog = ({ onAddTable }: TableDialogProps) => {
  const handleAddTable = () => {
    const newTable: Table = {
      id: Date.now().toString(),
      content: '<table><tr><td>New Table</td></tr></table>',
      caption: '',
      number: 1
    };
    onAddTable(newTable);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <PlusCircle className="w-4 h-4" />
          Add Table
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Table</DialogTitle>
        </DialogHeader>
        {/* Table creation form content */}
        <div className="space-y-4">
          <textarea
            placeholder="Enter table content..."
            className="w-full h-32 border rounded-md p-2"
          />
          <input
            type="text"
            placeholder="Enter table caption..."
            className="w-full border rounded-md p-2"
          />
          <Button onClick={handleAddTable} variant="outline">
            Create Table
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
