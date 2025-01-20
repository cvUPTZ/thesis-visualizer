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
      ...parsedReference,
      type: 'article',
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
      <Card className="p-4 mt-4 space-y-2 text-sm">
        <div>
          <strong>Authors:</strong>
          <ul className="list-disc pl-5">
            {parsedReference.authors.map((author: string, index: number) => (
              <li key={index}>{author}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <strong>Date:</strong> {parsedReference.year}
          {parsedReference.specific_date && ` (${parsedReference.specific_date})`}
        </div>
        
        <div>
          <strong>Article Title:</strong> {parsedReference.title}
        </div>
        
        {parsedReference.journal && (
          <div>
            <strong>Journal Name:</strong> <em>{parsedReference.journal}</em>
          </div>
        )}
        
        {(parsedReference.volume || parsedReference.issue) && (
          <div>
            <strong>Volume/Issue:</strong>
            {parsedReference.volume && ` Volume ${parsedReference.volume}`}
            {parsedReference.issue && ` Issue ${parsedReference.issue}`}
          </div>
        )}
        
        {parsedReference.pages && (
          <div>
            <strong>Page Range:</strong> {parsedReference.pages}
          </div>
        )}
        
        {parsedReference.doi && (
          <div>
            <strong>DOI:</strong> {parsedReference.doi}
          </div>
        )}
        
        {parsedReference.url && (
          <div>
            <strong>URL:</strong> {parsedReference.url}
          </div>
        )}
        
        {parsedReference.publisher && (
          <div>
            <strong>Publisher:</strong> {parsedReference.publisher}
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