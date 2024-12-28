import React from 'react';
import { Citation } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { CitationCard } from './citation/CitationCard';

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
  const handleAddCitation = () => {
    const newCitation: Citation = {
      id: Date.now().toString(),
      text: '',
      source: '',
      authors: [''],
      year: '',
      type: 'article'
    };
    onAddCitation(newCitation);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-serif font-medium text-primary">Citations</h3>
        <Button onClick={handleAddCitation} variant="outline" size="sm" className="gap-2">
          <PlusCircle className="w-4 h-4" />
          Add Citation
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {citations.map((citation) => (
          <CitationCard
            key={citation.id}
            citation={citation}
            onRemove={onRemoveCitation}
            onUpdate={onUpdateCitation}
          />
        ))}
      </div>
    </div>
  );
};