import React from 'react';
import { Table } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from 'lucide-react';

interface TableDialogProps {
  onAddTable: (table: Table) => void;
}

export const TableDialog = ({ onAddTable }: TableDialogProps) => {
  const [caption, setCaption] = React.useState('');
  const [content, setContent] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTable: Table = {
      id: Date.now().toString(),
      caption,
      content,
      title: caption
    };
    onAddTable(newTable);
    setCaption('');
    setContent('');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 bg-transparent border-gray-700 text-white hover:bg-white/5">
          <PlusCircle className="w-4 h-4" />
          Add Table
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] bg-[#1A1F2C] border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white font-sans">Add New Table</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="caption" className="text-sm font-medium text-gray-300 font-sans">
              Table Caption
            </label>
            <Input
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Enter table caption..."
              className="bg-white/5 border-gray-700 text-white placeholder-gray-400 font-sans"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium text-gray-300 font-sans">
              Table Content
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter table content (CSV format or markdown table)..."
              className="min-h-[200px] font-mono bg-white/5 border-gray-700 text-white placeholder-gray-400"
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white font-sans">Add Table</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};