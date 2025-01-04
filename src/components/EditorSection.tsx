import React from 'react';
import { Section } from '@/types/thesis';
import { useToast } from '@/hooks/use-toast';
import { SectionHeader } from './editor/SectionHeader';
import { SectionContent } from './editor/SectionContent';
import { SectionManagers } from './editor/SectionManagers';

interface EditorSectionProps {
  section: Section;
  isActive: boolean;
  onContentChange: (id: string, content: string) => void;
  onTitleChange: (id: string, title: string) => void;
}

export const EditorSection = ({
  section,
  isActive,
  onContentChange,
  onTitleChange
}: EditorSectionProps) => {
  const { toast } = useToast();
  console.log('EditorSection rendering with section:', section);

  if (!isActive) return null;

  const handleSectionUpdate = (updatedSection: Section) => {
    console.log('Updating section:', updatedSection);
    onContentChange(updatedSection.id, updatedSection.content);
    
    toast({
      title: "Success",
      description: "Section updated successfully",
    });
  };

  return (
    <div className="editor-section animate-fade-in bg-editor-bg border border-editor-border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-6 space-y-6">
        <SectionHeader
          title={section.title}
          required={section.required}
          onTitleChange={(title) => onTitleChange(section.id, title)}
        />
        
        <SectionContent
          content={section.content}
          onContentChange={(content) => onContentChange(section.id, content)}
        />

        <SectionManagers
          section={section}
          onSectionUpdate={handleSectionUpdate}
        />
      </div>
    </div>
  );
};