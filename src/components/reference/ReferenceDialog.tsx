import React from 'react';
import { Reference, ReferenceStyle } from '@/types/thesis';
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
import { useToast } from '@/hooks/use-toast';

interface ReferenceDialogProps {
  onAddReference: (reference: Reference) => void;
  referenceStyle?: ReferenceStyle;
}

export const ReferenceDialog = ({ onAddReference, referenceStyle = 'APA' }: ReferenceDialogProps) => {
  const [rawText, setRawText] = React.useState('');
  const { toast } = useToast();

  const parseReference = (text: string, style: ReferenceStyle): Partial<Reference> => {
    console.log('Parsing reference with style:', style);
    
    // Basic parsing logic - can be expanded for more accurate parsing
    const parts = text.split('.');
    let authors: string[] = [];
    let year = '';
    let title = '';
    let source = '';

    try {
      switch (style) {
        case 'APA':
          // Format: Author, A. A., & Author, B. B. (Year). Title. Source.
          const apaMatch = text.match(/(.+?)\((\d{4})\)\.\s(.+?)\.\s(.+)/);
          if (apaMatch) {
            authors = apaMatch[1].split(',').map(a => a.trim()).filter(a => a);
            year = apaMatch[2];
            title = apaMatch[3];
            source = apaMatch[4];
          }
          break;

        case 'MLA':
          // Format: Author. "Title." Source, Year.
          if (parts.length >= 3) {
            authors = [parts[0].trim()];
            title = parts[1].replace(/["'"]/g, '').trim();
            const sourceYear = parts[2].split(',');
            source = sourceYear[0].trim();
            year = sourceYear[1]?.trim() || '';
          }
          break;

        case 'Chicago':
          // Format: Author. Year. "Title." Source.
          if (parts.length >= 3) {
            authors = [parts[0].trim()];
            year = parts[1].trim();
            title = parts[2].replace(/["'"]/g, '').trim();
            source = parts.slice(3).join('.').trim();
          }
          break;

        case 'Harvard':
          // Format: Author (Year) Title, Source.
          const harvardMatch = text.match(/(.+?)\((\d{4})\)\s(.+?),\s(.+)/);
          if (harvardMatch) {
            authors = [harvardMatch[1].trim()];
            year = harvardMatch[2];
            title = harvardMatch[3];
            source = harvardMatch[4];
          }
          break;
      }
    } catch (error) {
      console.error('Error parsing reference:', error);
      toast({
        title: "Parsing Error",
        description: "Could not parse the reference text. Please check the format.",
        variant: "destructive"
      });
      return {};
    }

    return {
      authors,
      year,
      title,
      source,
      text: rawText,
      type: 'article'
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const parsedReference = parseReference(rawText, referenceStyle);
    
    if (!parsedReference.title || !parsedReference.authors?.length) {
      toast({
        title: "Invalid Reference",
        description: "Please check the reference format and try again.",
        variant: "destructive"
      });
      return;
    }

    const newReference: Reference = {
      id: Date.now().toString(),
      text: rawText,
      title: parsedReference.title || '',
      authors: parsedReference.authors || [],
      year: parsedReference.year || '',
      type: 'article',
      source: parsedReference.source || ''
    };

    onAddReference(newReference);
    setRawText('');
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
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder={`Enter reference text in ${referenceStyle} format...`}
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