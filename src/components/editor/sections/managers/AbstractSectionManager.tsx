import React from 'react';
import { Section } from '@/types/thesis';
import { Card } from '@/components/ui/card';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { Input } from '@/components/ui/input';

interface AbstractSectionManagerProps {
  section: Section;
  onUpdate: (section: Section) => void;
}

export const AbstractSectionManager: React.FC<AbstractSectionManagerProps> = ({
  section,
  onUpdate,
}) => {
  console.log('AbstractSectionManager rendering:', { sectionId: section.id });

  return (
    <Card className="p-6 space-y-4">
      <Input
        value={section.title}
        onChange={(e) => onUpdate({ ...section, title: e.target.value })}
        className="text-xl font-serif"
        placeholder="Abstract Title"
      />
      <MarkdownEditor
        value={typeof section.content === 'string' ? section.content : ''}
        onChange={(content) => onUpdate({ ...section, content })}
        placeholder="Write your abstract here..."
      />
    </Card>
  );
};