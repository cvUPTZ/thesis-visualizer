import React from 'react';
import { Card } from '@/components/ui/card';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { Section } from '@/types/thesis';

interface AbstractManagerProps {
  section: Section;
  onUpdate: (section: Section) => void;
}

export const AbstractManager: React.FC<AbstractManagerProps> = ({
  section,
  onUpdate,
}) => {
  console.log('AbstractManager rendering:', { sectionId: section.id });
  
  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-2xl font-serif font-semibold">Abstract</h2>
      <p className="text-muted-foreground">
        Provide a brief summary of your thesis, including your research question, methodology, and key findings.
      </p>
      <MarkdownEditor
        value={section.content}
        onChange={(value) => onUpdate({ ...section, content: value || '' })}
        placeholder="Write your abstract here..."
      />
    </Card>
  );
};