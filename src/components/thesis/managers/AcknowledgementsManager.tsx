import React from 'react';
import { Card } from '@/components/ui/card';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { Section } from '@/types/thesis';

interface AcknowledgementsManagerProps {
  section: Section;
  onUpdate: (section: Section) => void;
}

export const AcknowledgementsManager: React.FC<AcknowledgementsManagerProps> = ({
  section,
  onUpdate,
}) => {
  console.log('AcknowledgementsManager rendering:', { sectionId: section.id });
  
  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-2xl font-serif font-semibold">Acknowledgements</h2>
      <p className="text-muted-foreground">
        Express your gratitude to those who have supported your research journey.
      </p>
      <MarkdownEditor
        value={section.content}
        onChange={(value) => onUpdate({ ...section, content: value || '' })}
        placeholder="Write your acknowledgements here..."
      />
    </Card>
  );
};