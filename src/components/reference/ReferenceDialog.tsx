import React, { useState } from 'react';
import { Reference } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { parseReference } from '@/utils/referenceParser';

interface ReferenceDialogProps {
  onAddReference: (reference: Reference) => void;
}

export const ReferenceDialog = ({ onAddReference }: ReferenceDialogProps) => {
  const [rawText, setRawText] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('Attempting to parse reference:', rawText);
      const parsedReference = parseReference(rawText);
      
      if (!parsedReference.title || !parsedReference.authors.length) {
        throw new Error('Could not parse required fields from reference');
      }

      const newReference: Reference = {
        id: crypto.randomUUID(),
        ...parsedReference,
        type: 'article',
        source: parsedReference.publisher || parsedReference.journal || 'Unknown',
      };

      console.log('Parsed reference:', newReference);
      onAddReference(newReference);
      setRawText('');
      setIsOpen(false);
      
      toast({
        title: "Reference Added",
        description: "Successfully parsed and added the reference",
      });
    } catch (error) {
      console.error('Error parsing reference:', error);
      toast({
        title: "Parsing Error",
        description: "Could not parse the reference. Please check the format.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
            <Textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste your reference text here..."
              className="min-h-[100px]"
            />
            <p className="text-sm text-muted-foreground">
              Paste any formatted reference (APA, MLA, Chicago, etc.) and we'll automatically parse it.
            </p>
          </div>
          <div className="flex justify-end">
            <Button type="submit">Add Reference</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};