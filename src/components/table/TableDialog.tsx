import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Table } from '@/types/thesis';

interface TableDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onTableCreate?: (table: Table) => void;
  onAddTable?: (table: Table) => void;
}

export const TableDialog: React.FC<TableDialogProps> = ({
  open,
  onOpenChange,
  onTableCreate,
  onAddTable,
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [caption, setCaption] = useState('');

  const handleCreateTable = () => {
    const newTable: Table = {
      id: Date.now().toString(),
      title,
      content,
      caption,
      data: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    if (onTableCreate) onTableCreate(newTable);
    if (onAddTable) onAddTable(newTable);
    
    setTitle('');
    setContent('');
    setCaption('');
    if (onOpenChange) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Table</DialogTitle>
          <DialogDescription>
            <div className="space-y-4">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Table Title"
                className="w-full"
              />
              <Input
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Table Caption"
                className="w-full"
              />
              <Input
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Table Content (HTML)"
                className="w-full"
              />
              <Button onClick={handleCreateTable} className="w-full">
                Create Table
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};