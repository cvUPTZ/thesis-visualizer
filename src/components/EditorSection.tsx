import React from 'react';
import { Section } from '@/types/thesis';
import { useToast } from '@/hooks/use-toast';
import { SectionHeader } from './editor/SectionHeader';
import { SectionContent } from './editor/SectionContent';
import { SectionManagers } from './editor/SectionManagers';
import { SectionProps } from '@/types/components';

export const EditorSection: React.FC<SectionProps> = ({
  section,
  isActive,
  onContentChange,
  onTitleChange
}) => {
  const { toast } = useToast();
  console.log('EditorSection rendering with section:', { 
    id: section.id, 
    title: section.title,
    isActive 
  });

  if (!isActive) return null;

  const handleSectionUpdate = (updatedSection: Section) => {
    console.log('Updating section:', updatedSection);
    onContentChange(updatedSection.id, updatedSection.content);
    
    toast({
      title: "Success",
      description: "Section updated successfully",
    });
  };

  // Create a complete Section object from the minimal section data
  const fullSection: Section = {
    id: section.id,
    title: section.title,
    content: section.content,
    type: 'custom',
    order: 0,
    figures: [],
    tables: [],
    citations: [],
    required: false
  };

  return (
    <div className="editor-section">
      <div className="space-y-6">
        <SectionHeader
          title={fullSection.title}
          required={fullSection.required}
          onTitleChange={(title) => onTitleChange(fullSection.id, title)}
        />
        
        <SectionContent
          content={fullSection.content}
          onContentChange={(content) => onContentChange(fullSection.id, content)}
        />

        <SectionManagers
          section={fullSection}
          onSectionUpdate={handleSectionUpdate}
        />
      </div>
    </div>
  );
};