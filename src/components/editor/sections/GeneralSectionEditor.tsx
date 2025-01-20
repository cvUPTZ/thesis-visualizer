import React from 'react';
import { Section } from '@/types/thesis';
import { Card } from '@/components/ui/card';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { Input } from '@/components/ui/input';

interface GeneralSectionEditorProps {
  section: Section;
  title: string;
  onUpdate: (section: Section) => void;
}

export const GeneralSectionEditor: React.FC<GeneralSectionEditorProps> = ({
  section,
  title,
  onUpdate,
}) => {
  console.log('GeneralSectionEditor rendering:', { title, section });
  
  return (
    <Card className="p-6 space-y-4">
      <div className="space-y-2">
        <Input
          value={section.title || title}
          onChange={(e) => onUpdate({ ...section, title: e.target.value })}
          className="text-xl font-serif"
          placeholder={title}
        />
      </div>
      
      <MarkdownEditor
        value={section.content || ''}
        onChange={(value) => onUpdate({ ...section, content: value || '' })}
        placeholder={`Write your ${title.toLowerCase()} here...`}
      />
    </Card>
  );
};