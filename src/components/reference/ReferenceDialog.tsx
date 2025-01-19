import React from 'react';
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

interface ReferenceDialogProps {
  onAddReference: (reference: Reference) => void;
  defaultType?: 'article' | 'book' | 'conference' | 'thesis' | 'website' | 'other';
}

export const ReferenceDialog = ({ onAddReference, defaultType = 'article' }: ReferenceDialogProps) => {
  const [text, setText] = React.useState('');
  const { toast } = useToast();

  const parseReference = (text: string, type: string) => {
    // Basic parsing logic - this can be enhanced based on the reference type
    const parts = text.split('.');
    let reference: Partial<Reference> = {
      id: Date.now().toString(),
      text,
      type,
      authors: [],
      year: '',
      title: '',
      source: ''
    };

    try {
      switch (type) {
        case 'article':
          // Author(s). (Year). Title. Journal, Volume(Issue), Pages.
          if (parts.length >= 3) {
            reference.authors = parts[0].split(',').map(a => a.trim());
            const yearMatch = parts[1].match(/\((\d{4})\)/);
            reference.year = yearMatch ? yearMatch[1] : '';
            reference.title = parts[2].trim();
            if (parts[3]) {
              reference.source = parts[3].trim();
            }
          }
          break;
        case 'book':
          // Author(s). (Year). Title. Publisher.
          if (parts.length >= 3) {
            reference.authors = parts[0].split(',').map(a => a.trim());
            const yearMatch = parts[1].match(/\((\d{4})\)/);
            reference.year = yearMatch ? yearMatch[1] : '';
            reference.title = parts[2].trim();
            if (parts[3]) {
              reference.publisher = parts[3].trim();
            }
          }
          break;
        default:
          // Basic fallback parsing
          if (parts.length >= 2) {
            reference.title = parts[0].trim();
            reference.source = parts[1].trim();
          }
      }
    } catch (error) {
      console.error('Error parsing reference:', error);
      toast({
        title: "Parsing Error",
        description: "Could not parse the reference text. Please check the format.",
        variant: "destructive"
      });
    }

    return reference as Reference;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Reference text is required",
        variant: "destructive"
      });
      return;
    }

    const reference = parseReference(text, defaultType);
    onAddReference(reference);
    setText('');
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
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the complete reference text..."
              className="min-h-[100px]"
            />
            <p className="text-sm text-muted-foreground">
              Format: Author(s). (Year). Title. Source.
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