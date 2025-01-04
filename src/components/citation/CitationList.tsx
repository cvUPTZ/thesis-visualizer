import React from 'react';
import { Citation } from '@/types/thesis';
import { CitationCard } from './CitationCard';

interface CitationListProps {
  citations: Citation[];
  onRemove: (id: string) => void;
  onUpdate: (citation: Citation) => void;
  onPreview: (citation: Citation) => void;
}

export const CitationList = ({
  citations,
  onRemove,
  onUpdate,
  onPreview
}: CitationListProps) => {
  if (citations.length === 0) {
    return (
      <div className="col-span-2 text-center py-8 text-muted-foreground">
        No citations found. Try adjusting your filters or add a new citation.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {citations.map((citation) => (
        <CitationCard
          key={citation.id}
          citation={citation}
          onRemove={onRemove}
          onUpdate={onUpdate}
          onPreview={() => onPreview(citation)}
        />
      ))}
    </div>
  );
};