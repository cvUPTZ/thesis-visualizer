import React from 'react';
import { Reference } from '@/types/thesis';
import { ReferenceDialog } from './reference/ReferenceDialog';
import { ReferenceCard } from './reference/ReferenceCard';
import { ReferenceManagerProps } from '@/types/components';

export const ReferenceManager: React.FC<ReferenceManagerProps> = ({
  items,
  onAdd,
  onRemove,
  onUpdate
}) => {
  console.log('ReferenceManager rendering with items:', items);

  return (
    <div className="editor-manager-card">
      <div className="editor-manager-header">
        <h3 className="editor-manager-title font-serif text-lg font-medium text-editor-text">References</h3>
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