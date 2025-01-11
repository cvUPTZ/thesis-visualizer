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

    const handleSectionDataUpdate = (updatedSection: Section) => {
    console.log('Updating section:', updatedSection);
      onContentChange(updatedSection.id, updatedSection.content)
        onTitleChange(updatedSection.id, updatedSection.title)
       
    toast({
      title: "Success",
      description: "Section updated successfully",
    });
  };
   
    const handleSectionTaskUpdate = (updatedSection: Section) => {
        console.log('Updating section:', updatedSection);
       
       
        onContentChange(updatedSection.id, updatedSection.content)
        toast({
            title: "Success",
            description: "Section updated successfully",
        });
  };

  return (
    <div className="editor-section">
      <div className="space-y-6">
        <SectionHeader
          title={section.title}
          required={section.required}
          onTitleChange={(title) => onTitleChange(section.id, title)}
        />
        
        <SectionContent
          content={section.content}
          onContentChange={(content) => onContentChange(section.id, content)}
          section={section}
            isActive={isActive}
           onUpdateSectionData={handleSectionTaskUpdate}
        />

        <SectionManagers
          section={section}
          onSectionUpdate={handleSectionDataUpdate}
        />
      </div>
    </div>
  );
};