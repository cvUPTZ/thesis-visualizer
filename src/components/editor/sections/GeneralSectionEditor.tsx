import React from 'react';
import { Section, StructuredContent } from '@/types/thesis';
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

  const handleContentChange = (value: string | undefined) => {
    console.log('Content changed:', value);
    
    const updatedSection = {
      ...section,
      content: value || ''
    };
    
    console.log('Updating section with:', updatedSection);
    onUpdate(updatedSection);
  };

  const getContentValue = () => {
    if (!section.content) return '';
    if (Array.isArray(section.content)) {
      return section.content.map(item => item.content).join('\n\n');
    }
    return section.content;
  };
  
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
        value={getContentValue()}
        onChange={handleContentChange}
        placeholder={`Write your ${title.toLowerCase()} here...`}
      />
    </Card>
  );
};