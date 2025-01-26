import React from 'react';
import { Section } from '@/types/thesis';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ReferenceManager } from '@/components/ReferenceManager';

interface ReferenceSectionManagerProps {
  section: Section;
  onUpdate: (section: Section) => void;
}

export const ReferenceSectionManager: React.FC<ReferenceSectionManagerProps> = ({
  section,
  onUpdate,
}) => {
  console.log('ReferenceSectionManager rendering:', { sectionId: section.id });

  return (
    <Card className="p-6 space-y-4">
      <Input
        value={section.title}
        onChange={(e) => onUpdate({ ...section, title: e.target.value })}
        className="text-xl font-serif"
        placeholder="References"
      />
      
      <ReferenceManager
        items={section.references || []}
        onAdd={(reference) => onUpdate({
          ...section,
          references: [...(section.references || []), reference]
        })}
        onRemove={(id) => onUpdate({
          ...section,
          references: (section.references || []).filter(r => r.id !== id)
        })}
        onUpdate={(reference) => onUpdate({
          ...section,
          references: (section.references || []).map(r => r.id === reference.id ? reference : r)
        })}
      />
    </Card>
  );
};