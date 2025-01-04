import React, { useCallback } from 'react';
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
  console.log('EditorSection rendering with section:', { 
    id: section.id, 
    title: section.title,
    isActive 
  });

  const handleContentChange = useCallback((content: string) => {
    try {
      console.log('Updating section content:', { 
        sectionId: section.id, 
        contentLength: content.length 
      });
      onContentChange(section.id, content);
    } catch (error) {
      console.error('Error updating section content:', error);
      toast({
        title: "Error",
        description: "Failed to update section content. Please try again.",
        variant: "destructive"
      });
    }
  }, [section.id, onContentChange, toast]);

  const handleTitleChange = useCallback((title: string) => {
    try {
      console.log('Updating section title:', { 
        sectionId: section.id, 
        newTitle: title 
      });
      onTitleChange(section.id, title);
    } catch (error) {
      console.error('Error updating section title:', error);
      toast({
        title: "Error",
        description: "Failed to update section title. Please try again.",
        variant: "destructive"
      });
    }
  }, [section.id, onTitleChange, toast]);

  if (!isActive) return null;

  const handleSectionUpdate = useCallback((updatedSection: Section) => {
    console.log('Updating section:', updatedSection);
    handleContentChange(updatedSection.content);
    
    toast({
      title: "Success",
      description: "Section updated successfully",
    });
  }, [handleContentChange, toast]);

  return (
    <div className="editor-section animate-fade-in bg-editor-gradient">
      <div className="editor-content space-y-6">
        <SectionHeader
          title={section.title}
          required={section.required}
          onTitleChange={handleTitleChange}
        />
        
        <SectionContent
          content={section.content}
          onContentChange={handleContentChange}
        />

        <SectionManagers
          section={section}
          onSectionUpdate={handleSectionUpdate}
        />
      </div>
    </div>
  );
};