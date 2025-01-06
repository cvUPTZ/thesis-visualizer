import React from 'react';
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table2 } from 'lucide-react';

export const TableDialogHeader = () => {
  return (
    <DialogHeader>
      <DialogTitle className="flex items-center gap-2 text-lg font-serif">
        <Table2 className="w-5 h-5 text-primary" />
        Create New Table
      </DialogTitle>
      <p className="text-sm text-muted-foreground mt-1">
        Design your table with an Excel-like interface. Add rows and columns as needed.
      </p>
    </DialogHeader>
  );
};