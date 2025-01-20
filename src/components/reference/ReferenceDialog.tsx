import React, { useState } from 'react';
import { Reference } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
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
import { TagInput } from '@/components/ui/tag-input';

interface ReferenceDialogProps {
  onAddReference: (reference: Reference) => void;
}

export const ReferenceDialog = ({ onAddReference }: ReferenceDialogProps) => {
  const [rawText, setRawText] = useState('');
  const [parsedReference, setParsedReference] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
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
      setIsEditing(true);
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
    setIsEditing(false);
    setIsOpen(false);
    
    toast({
      title: "Reference Added",
      description: "Successfully added the reference",
    });
  };

  const handleUpdateParsedField = (field: string, value: any) => {
    setParsedReference(prev => ({
      ...prev,
      [field]: value
    }));
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

          {parsedReference && isEditing && (
            <Card className="p-4 mt-4 space-y-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-semibold">Authors:</h4>
                <TagInput
                  placeholder="Add authors"
                  tags={parsedReference.authors}
                  onChange={(tags) => handleUpdateParsedField('authors', tags)}
                />
              </div>
              
              <div>
                <h4 className="font-semibold">Year:</h4>
                <Input
                  value={parsedReference.year}
                  onChange={(e) => handleUpdateParsedField('year', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <h4 className="font-semibold">Title:</h4>
                <Input
                  value={parsedReference.title}
                  onChange={(e) => handleUpdateParsedField('title', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <h4 className="font-semibold">Journal:</h4>
                <Input
                  value={parsedReference.journal || ''}
                  onChange={(e) => handleUpdateParsedField('journal', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold">Volume:</h4>
                  <Input
                    value={parsedReference.volume || ''}
                    onChange={(e) => handleUpdateParsedField('volume', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Issue:</h4>
                  <Input
                    value={parsedReference.issue || ''}
                    onChange={(e) => handleUpdateParsedField('issue', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <h4 className="font-semibold">Pages:</h4>
                  <Input
                    value={parsedReference.pages || ''}
                    onChange={(e) => handleUpdateParsedField('pages', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold">DOI:</h4>
                <Input
                  value={parsedReference.doi || ''}
                  onChange={(e) => handleUpdateParsedField('doi', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <h4 className="font-semibold">URL:</h4>
                <Input
                  value={parsedReference.url || ''}
                  onChange={(e) => handleUpdateParsedField('url', e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <h4 className="font-semibold">Publisher:</h4>
                <Input
                  value={parsedReference.publisher || ''}
                  onChange={(e) => handleUpdateParsedField('publisher', e.target.value)}
                  className="mt-1"
                />
              </div>
            </Card>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};