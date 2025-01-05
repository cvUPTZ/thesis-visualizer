import React from 'react';
import { Reference } from '@/types/thesis';
import { ReferenceDialog } from './reference/ReferenceDialog';
import { ReferenceCard } from './reference/ReferenceCard';

export interface ReferenceManagerProps {
  items: Reference[];
  onAdd: (reference: Reference) => void;
  onRemove: (id: string) => void;
  onUpdate: (reference: Reference) => void;
}

export const ReferenceManager: React.FC<ReferenceManagerProps> = ({
  items,
  onAdd,
  onRemove,
  onUpdate
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-serif font-medium text-primary">References</h3>
        <ReferenceDialog onAddReference={onAdd} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((reference) => (
          <ReferenceCard
            key={reference.id}
            reference={reference}
            onRemove={onRemove}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </div>
  );
};