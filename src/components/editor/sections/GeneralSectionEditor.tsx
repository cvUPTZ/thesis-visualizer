import React from 'react';
import { Section } from '@/types/thesis';
import { Card } from '@/components/ui/card';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface GeneralSectionEditorProps {
  section: Section | undefined;
  title: string;
  onUpdate: (section: Section) => void;
}

export const GeneralSectionEditor: React.FC<GeneralSectionEditorProps> = ({
  section,
  title,
  onUpdate,
}) => {
  const { toast } = useToast();
  
  const handleContentChange = (content: string | undefined) => {
    const updatedSection: Section = {
      id: section?.id || Date.now().toString(),
      title: section?.title || title,
      content: content || '',
      type: 'general',
      order: section?.order || 0,
      figures: section?.figures || [],
      tables: section?.tables || [],
      citations: section?.citations || [],
      references: section?.references || []
    };
    
    onUpdate(updatedSection);
    
    toast({
      title: "Section Updated",
      description: "Your changes have been saved",
    });
  };

  const handleTitleChange = (newTitle: string) => {
    if (!section) return;
    
    const updatedSection: Section = {
      ...section,
      title: newTitle
    };
    
    onUpdate(updatedSection);
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="space-y-2">
        <Input
          value={section?.title || title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="text-xl font-serif"
          placeholder={title}
        />
      </div>
      
      <MarkdownEditor
        value={section?.content || ''}
        onChange={(value) => handleContentChange(value || '')}
        placeholder={`Write your ${title.toLowerCase()} here...`}
      />
    </Card>
  );
};