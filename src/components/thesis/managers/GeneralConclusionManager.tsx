import React from 'react';
import { Card } from '@/components/ui/card';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { Section } from '@/types/thesis';

interface GeneralConclusionManagerProps {
  section: Section;
  onUpdate: (section: Section) => void;
}

export const GeneralConclusionManager: React.FC<GeneralConclusionManagerProps> = ({
  section,
  onUpdate,
}) => {
  console.log('GeneralConclusionManager rendering:', { sectionId: section.id });
  
  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-2xl font-serif font-semibold">General Conclusion</h2>
      <p className="text-muted-foreground">
        Summarize your key findings and discuss their implications for your field.
      </p>
      <MarkdownEditor
        value={section.content}
        onChange={(value) => onUpdate({ ...section, content: value || '' })}
        placeholder="Write your general conclusion here..."
      />
    </Card>
  );
};