import React from 'react';
import { Reference } from '@/types/thesis';
import { ReferenceDialog } from './reference/ReferenceDialog';
import { ReferenceCard } from './reference/ReferenceCard';

interface ReferenceManagerProps {
  references: Reference[];
  onAddReference: (reference: Reference) => void;
  onRemoveReference: (id: string) => void;
  onUpdateReference: (reference: Reference) => void;
}

export const ReferenceManager = ({
  references,
  onAddReference,
  onRemoveReference,
  onUpdateReference
}: ReferenceManagerProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-serif font-medium text-primary">References</h3>
        <ReferenceDialog onAddReference={onAddReference} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {references.map((reference) => (
          <ReferenceCard
            key={reference.id}
            reference={reference}
            onRemove={onRemoveReference}
            onUpdate={onUpdateReference}
          />
        ))}
      </div>
    </div>
  );
};