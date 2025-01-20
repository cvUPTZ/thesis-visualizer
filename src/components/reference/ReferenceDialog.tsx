import React from 'react';
import { Reference, ReferenceStyle } from '@/types/thesis';
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
  referenceStyle?: ReferenceStyle;
}

export const ReferenceDialog = ({ onAddReference, referenceStyle = 'APA' }: ReferenceDialogProps) => {
  const [rawText, setRawText] = React.useState('');
  const { toast } = useToast();

  const parseAuthorInformation = (authorText: string) => {
    const authors = authorText.split(',').map(author => author.trim());
    return authors.map(author => {
      const parts = author.split(' ');
      const lastName = parts.pop() || '';
      const firstInitial = parts[0]?.[0] || '';
      const middleInitial = parts[1]?.[0] || '';
      
      return {
        lastName,
        firstInitial,
        middleInitial
      };
    });
  };

  const parseDateInformation = (dateText: string) => {
    const yearMatch = dateText.match(/\d{4}/);
    const specificDateMatch = dateText.match(/(\d{4}),?\s+([A-Za-z]+)\s+(\d{1,2})/);
    
    return {
      year: yearMatch ? yearMatch[0] : 'n.d.',
      specificDate: specificDateMatch ? `${specificDateMatch[1]}, ${specificDateMatch[2]} ${specificDateMatch[3]}` : undefined
    };
  };

  const parseReference = (text: string, style: ReferenceStyle): Partial<Reference> => {
    console.log('Parsing reference with style:', style);
    
    try {
      let authorInfo;
      let dateInfo;
      let titleInfo;
      let publicationInfo;

      switch (style) {
        case 'APA': {
          // Format: Author, A. A., & Author, B. B. (Year). Title. Source.
          const parts = text.split('.');
          const authorDatePart = parts[0].split('(');
          
          authorInfo = parseAuthorInformation(authorDatePart[0]);
          dateInfo = parseDateInformation(authorDatePart[1].replace(')', ''));
          
          titleInfo = {
            title: parts[1].trim(),
            containerTitle: parts[2]?.trim()
          };
          
          publicationInfo = {
            journal: parts[2]?.includes('Journal') ? parts[2].trim() : undefined,
            volume: parts[2]?.match(/(\d+)/)?.[1],
            pages: parts[2]?.match(/(\d+)-(\d+)/)?.[0],
            doi: parts[3]?.includes('doi') ? parts[3].trim() : undefined
          };
          break;
        }
        // Add other citation styles here...
      }

      return {
        authors: authorInfo.map(a => `${a.lastName}, ${a.firstInitial}${a.middleInitial ? `. ${a.middleInitial}` : ''}.`),
        year: dateInfo.year,
        title: titleInfo.title,
        text: rawText,
        type: 'article',
        ...publicationInfo
      };
    } catch (error) {
      console.error('Error parsing reference:', error);
      toast({
        title: "Parsing Error",
        description: "Could not parse the reference text. Please check the format.",
        variant: "destructive"
      });
      return {};
    }
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
      id: crypto.randomUUID(),
      text: rawText,
      title: parsedReference.title,
      authors: parsedReference.authors,
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