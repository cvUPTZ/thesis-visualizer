import React, { useState } from 'react';
import { Citation } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { CitationCard } from './citation/CitationCard';
import { CitationPreview } from './citation/CitationPreview';
import { CitationSearch } from './citation/CitationSearch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface CitationManagerProps {
  citations: Citation[];
  onAddCitation: (citation: Citation) => void;
  onRemoveCitation: (id: string) => void;
  onUpdateCitation: (citation: Citation) => void;
}

export const CitationManager = ({
  citations,
  onAddCitation,
  onRemoveCitation,
  onUpdateCitation
}: CitationManagerProps) => {
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);

  const handleAddCitation = () => {
    const newCitation: Citation = {
      id: Date.now().toString(),
      text: '',
      source: '',
      authors: [''],
      year: '',
      type: 'article',
      doi: '',
      url: '',
      journal: '',
      volume: '',
      issue: '',
      pages: '',
      publisher: ''
    };
    onAddCitation(newCitation);
  };

  const handleSearchResult = (citation: Citation) => {
    onAddCitation(citation);
    setSearchDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-serif font-medium text-primary">Citations</h3>
        <div className="flex gap-2">
          <Dialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Search Citations
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Search Citations</DialogTitle>
              </DialogHeader>
              <CitationSearch onSelect={handleSearchResult} />
            </DialogContent>
          </Dialog>
          <Button onClick={handleAddCitation} variant="outline" size="sm" className="gap-2">
            <PlusCircle className="w-4 h-4" />
            Add Citation
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {citations.map((citation) => (
          <CitationCard
            key={citation.id}
            citation={citation}
            onRemove={onRemoveCitation}
            onUpdate={onUpdateCitation}
            onPreview={() => setSelectedCitation(citation)}
          />
        ))}
      </div>

      <Dialog open={!!selectedCitation} onOpenChange={() => setSelectedCitation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Citation Preview</DialogTitle>
          </DialogHeader>
          {selectedCitation && (
            <CitationPreview citation={selectedCitation} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};