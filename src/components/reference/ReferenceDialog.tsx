import React from 'react';
import { Reference } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagInput } from '@/components/ui/tag-input';

interface ReferenceDialogProps {
  onAddReference: (reference: Reference) => void;
}

export const ReferenceDialog = ({ onAddReference }: ReferenceDialogProps) => {
  const [title, setTitle] = React.useState('');
  const [authors, setAuthors] = React.useState<string[]>(['']);
  const [year, setYear] = React.useState('');
  const [type, setType] = React.useState<'article' | 'book' | 'conference' | 'thesis' | 'website' | 'other'>('article');
  const [text, setText] = React.useState('');
  const [source, setSource] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReference: Reference = {
      id: Date.now().toString(),
      title,
      authors,
      year,
      type,
      text,
      source
    };
    onAddReference(newReference);
    setTitle('');
    setAuthors(['']);
    setYear('');
    setType('article');
    setText('');
    setSource('');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <PlusCircle className="w-4 h-4" />
          Add Reference
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Add New Reference</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <Select value={type} onValueChange={(value: any) => setType(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="book">Book</SelectItem>
                <SelectItem value="conference">Conference</SelectItem>
                <SelectItem value="thesis">Thesis</SelectItem>
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter reference title..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Text</label>
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter reference text..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Source</label>
            <Input
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Enter reference source..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Authors</label>
            <TagInput
              placeholder="Add authors (press Enter or comma to add)"
              tags={authors}
              onChange={setAuthors}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Year</label>
            <Input
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="Publication year..."
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit">Add Reference</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};