import React from 'react';
import { Card } from '@/components/ui/card';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { Section } from '@/types/thesis';

interface ThesisStructureManagerProps {
  section: Section;
  onUpdate: (section: Section) => void;
}

export const ThesisStructureManager: React.FC<ThesisStructureManagerProps> = ({
  section,
  onUpdate,
}) => {
  console.log('ThesisStructureManager rendering:', { sectionId: section.id });
  
  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-2xl font-serif font-semibold">Thesis Structure Overview</h2>
      <p className="text-muted-foreground">
        Outline the organization of your thesis and briefly describe each chapter.
      </p>
      <MarkdownEditor
        value={section.content}
        onChange={(value) => onUpdate({ ...section, content: value || '' })}
        placeholder="Write your thesis structure overview here..."
      />
    </Card>
  );
};