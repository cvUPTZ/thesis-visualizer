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
  defaultStyle?: 'APA' | 'MLA' | 'Chicago' | 'Vancouver' | 'Harvard';
}

export const ReferenceDialog = ({ onAddReference, defaultStyle = 'APA' }: ReferenceDialogProps) => {
  const [text, setText] = React.useState('');
  const { toast } = useToast();

  const parseReference = (text: string, style: string) => {
    const reference: Partial<Reference> = {
      id: Date.now().toString(),
      text,
      style: style as Reference['style'],
      authors: [],
      year: '',
      title: '',
      source: ''
    };

    try {
      switch (style) {
        case 'APA':
          // Author, A. A., & Author, B. B. (Year). Title of article. Title of Journal, volume(issue), pages.
          const apaMatch = text.match(/^(.*?)\((.*?)\)\.(.*?)\.(.*)$/);
          if (apaMatch) {
            reference.authors = apaMatch[1].split(',').map(a => a.trim());
            reference.year = apaMatch[2].trim();
            reference.title = apaMatch[3].trim();
            reference.source = apaMatch[4].trim();
          }
          break;

        case 'MLA':
          // Author. "Title." Journal Name, Volume, Issue, Year, Pages.
          const mlaMatch = text.match(/^(.*?)\."(.*?)".(.*?),(.*)$/);
          if (mlaMatch) {
            reference.authors = [mlaMatch[1].trim()];
            reference.title = mlaMatch[2].trim();
            reference.source = mlaMatch[3].trim();
            const details = mlaMatch[4].split(',').map(s => s.trim());
            reference.year = details.find(d => /^\d{4}$/.test(d)) || '';
          }
          break;

        case 'Chicago':
          // Author. Title. Place of Publication: Publisher, Year.
          const chicagoMatch = text.match(/^(.*?)\.(.*?)\.(.*?):\s*(.*?),\s*(.*)$/);
          if (chicagoMatch) {
            reference.authors = [chicagoMatch[1].trim()];
            reference.title = chicagoMatch[2].trim();
            reference.publisher = chicagoMatch[4].trim();
            reference.year = chicagoMatch[5].trim();
          }
          break;

        case 'Vancouver':
          // Author AA, Author BB. Title. Journal. Year;Volume(Issue):Pages.
          const vancouverMatch = text.match(/^(.*?)\.(.*?)\.(.*?)\.(.*?);(.*)$/);
          if (vancouverMatch) {
            reference.authors = vancouverMatch[1].split(',').map(a => a.trim());
            reference.title = vancouverMatch[2].trim();
            reference.source = vancouverMatch[3].trim();
            reference.year = vancouverMatch[4].trim();
          }
          break;

        case 'Harvard':
          // Author, A.A. and Author, B.B. (Year) Title. Journal, Volume(Issue), pages.
          const harvardMatch = text.match(/^(.*?)\((.*?)\)(.*?)\.(.*?)$/);
          if (harvardMatch) {
            reference.authors = harvardMatch[1].split('and').map(a => a.trim());
            reference.year = harvardMatch[2].trim();
            reference.title = harvardMatch[3].trim();
            reference.source = harvardMatch[4].trim();
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

    const reference = parseReference(text, defaultStyle);
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
          <DialogTitle>Add New Reference ({defaultStyle} Style)</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Reference Text</label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`Enter the complete reference text in ${defaultStyle} format...`}
              className="min-h-[100px]"
            />
            <p className="text-sm text-muted-foreground">
              Format will be parsed according to {defaultStyle} style guidelines
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