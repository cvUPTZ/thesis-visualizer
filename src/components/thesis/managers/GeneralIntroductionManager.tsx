import React from 'react';
import { Card } from '@/components/ui/card';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { Section } from '@/types/thesis';

interface GeneralIntroductionManagerProps {
  section: Section;
  onUpdate: (section: Section) => void;
}

export const GeneralIntroductionManager: React.FC<GeneralIntroductionManagerProps> = ({
  section,
  onUpdate,
}) => {
  console.log('GeneralIntroductionManager rendering:', { sectionId: section.id });
  
  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-2xl font-serif font-semibold">General Introduction</h2>
      <MarkdownEditor
        value={section.content}
        onChange={(value) => onUpdate({ ...section, content: value || '' })}
        placeholder="Write your general introduction here..."
      />
    </Card>
  );
};