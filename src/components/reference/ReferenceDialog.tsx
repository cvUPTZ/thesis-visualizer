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
import { Card } from '@/components/ui/card';

interface ReferenceDialogProps {
  onAddReference: (reference: Reference) => void;
}

export const ReferenceDialog = ({ onAddReference }: ReferenceDialogProps) => {
  const [rawText, setRawText] = useState('');
  const [parsedReference, setParsedReference] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('Attempting to parse reference:', rawText);
      const parsed = parseReference(rawText);
      
      if (!parsed.title || !parsed.authors.length) {
        throw new Error('Could not parse required fields from reference');
      }

      setParsedReference(parsed);
      console.log('Parsed reference:', parsed);

    } catch (error) {
      console.error('Error parsing reference:', error);
      toast({
        title: "Parsing Error",
        description: "Could not parse the reference. Please check the format.",
        variant: "destructive"
      });
    }
  };

  const handleAddReference = () => {
    if (!parsedReference) return;

    const newReference: Reference = {
      id: crypto.randomUUID(),
      text: rawText,
      title: parsedReference.title,
      source: parsedReference.journal || 'Unknown',
      authors: parsedReference.authors,
      year: parsedReference.year,
      type: 'article',
      doi: parsedReference.doi,
      url: parsedReference.url,
      journal: parsedReference.journal,
      volume: parsedReference.volume,
      issue: parsedReference.issue,
      pages: parsedReference.pages,
      publisher: parsedReference.publisher,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    onAddReference(newReference);
    setRawText('');
    setParsedReference(null);
    setIsOpen(false);
    
    toast({
      title: "Reference Added",
      description: "Successfully added the reference",
    });
  };

  const formatParsedReference = () => {
    if (!parsedReference) return null;

    return (
      <Card className="p-4 mt-4 space-y-4 text-sm">
        <div className="space-y-2">
          <h4 className="font-semibold">Authors:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {parsedReference.authors.map((author: string, index: number) => (
              <li key={index} className="text-gray-700">
                {parsedReference.author_last_names[index]}, {parsedReference.author_first_initials[index]}.
                {parsedReference.author_middle_initials[index] && 
                  ` ${parsedReference.author_middle_initials[index]}.`}
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold">Date:</h4>
          <p className="text-gray-700">{parsedReference.year}
            {parsedReference.specific_date && ` (${parsedReference.specific_date})`}
          </p>
        </div>
        
        <div>
          <h4 className="font-semibold">Article Title:</h4>
          <p className="text-gray-700">{parsedReference.title}</p>
        </div>
        
        {parsedReference.journal && (
          <div>
            <h4 className="font-semibold">Journal Name:</h4>
            <p className="italic text-gray-700">{parsedReference.journal}</p>
          </div>
        )}
        
        {(parsedReference.volume || parsedReference.issue) && (
          <div>
            <h4 className="font-semibold">Volume/Issue:</h4>
            <p className="text-gray-700">
              {parsedReference.volume && `Volume ${parsedReference.volume}`}
              {parsedReference.issue && ` Issue ${parsedReference.issue}`}
            </p>
          </div>
        )}
        
        {parsedReference.pages && (
          <div>
            <h4 className="font-semibold">Page Range:</h4>
            <p className="text-gray-700">{parsedReference.pages}</p>
          </div>
        )}
        
        {parsedReference.doi && (
          <div>
            <h4 className="font-semibold">DOI:</h4>
            <p className="text-gray-700">{parsedReference.doi}</p>
          </div>
        )}
        
        {parsedReference.url && (
          <div>
            <h4 className="font-semibold">URL:</h4>
            <p className="text-gray-700 break-all">{parsedReference.url}</p>
          </div>
        )}
        
        {parsedReference.publisher && (
          <div>
            <h4 className="font-semibold">Publisher:</h4>
            <p className="text-gray-700">{parsedReference.publisher}</p>
          </div>
        )}
      </Card>
    );
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
          
          <div className="flex gap-2">
            <Button type="submit" variant="outline">Parse Reference</Button>
            {parsedReference && (
              <Button type="button" onClick={handleAddReference}>
                Add Reference
              </Button>
            )}
          </div>

          {formatParsedReference()}
        </form>
      </DialogContent>
    </Dialog>
  );
};