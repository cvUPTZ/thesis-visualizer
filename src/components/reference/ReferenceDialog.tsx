import React, { useState } from 'react';
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
import { parseReference } from '@/utils/referenceParser';
import { useToast } from '@/hooks/use-toast';

interface ReferenceDialogProps {
  onAddReference: (reference: Reference) => void;
  referenceStyle?: string;
}

export const ReferenceDialog = ({ onAddReference, referenceStyle = 'APA' }: ReferenceDialogProps) => {
  const [text, setText] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const parsedReference = parseReference(text, referenceStyle);
      
      const newReference: Reference = {
        id: Date.now().toString(),
        text,
        title: parsedReference.title || text,
        source: parsedReference.journal || '',
        authors: parsedReference.authors || [],
        year: parsedReference.year || '',
        type: 'article',
        doi: parsedReference.doi,
        url: parsedReference.url,
        journal: parsedReference.journal,
        volume: parsedReference.volume,
        issue: parsedReference.issue,
        pages: parsedReference.pages,
        publisher: parsedReference.publisher
      };

      onAddReference(newReference);
      setText('');
      
      toast({
        title: "Reference added",
        description: "The reference has been successfully parsed and added.",
      });
    } catch (error) {
      console.error('Error parsing reference:', error);
      toast({
        title: "Error adding reference",
        description: "Failed to parse the reference. Please check the format matches the selected style.",
        variant: "destructive",
      });
    }
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
            <label className="text-sm font-medium">Reference Text</label>
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`Enter reference in ${referenceStyle} format...`}
              className="min-h-[100px]"
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