import React, { useCallback, useState } from 'react';
import { Section } from '@/types/thesis';
import { useToast } from '@/hooks/use-toast';
import { SectionHeader } from './editor/SectionHeader';
import { SectionContent } from './editor/SectionContent';
import { SectionManagers } from './editor/SectionManagers';

interface EditorSectionProps {
  section: Section;
  onContentChange: (id: string, content: string) => void;
  onTitleChange: (id: string, title: string) => void;
  isActive: boolean;
}

export const EditorSection = ({ 
  section, 
  onContentChange, 
  onTitleChange, 
  isActive 
}: EditorSectionProps) => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleContentChange = useCallback(async (content: string) => {
    try {
      setIsUpdating(true);
      console.log('Updating section content:', { 
        sectionId: section.id, 
        contentLength: content.length 
      });
      
      await onContentChange(section.id, content);
      
      toast({
        title: "Saved",
        description: "Content updated successfully",
      });
    } catch (error) {
      console.error('Error updating section content:', error);
      toast({
        title: "Error",
        description: "Failed to update section content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  }, [section.id, onContentChange, toast]);

  const handleTitleChange = useCallback(async (title: string) => {
    try {
      setIsUpdating(true);
      console.log('Updating section title:', { 
        sectionId: section.id, 
        newTitle: title 
      });
      
      await onTitleChange(section.id, title);
      
      toast({
        title: "Saved",
        description: "Title updated successfully",
      });
    } catch (error) {
      console.error('Error updating section title:', error);
      toast({
        title: "Error",
        description: "Failed to update section title. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  }, [section.id, onTitleChange, toast]);

  if (!isActive) return null;

  return (
    <div className="editor-section animate-fade-in bg-editor-gradient">
      <div className="editor-content">
        <SectionHeader
          title={section.title}
          required={section.required}
          onTitleChange={handleTitleChange}
        />
        
        <SectionContent
          content={section.content}
          onContentChange={handleContentChange}
          isLoading={isUpdating}
        />

        <SectionManagers
          section={section}
          handleContentChange={handleContentChange}
        />
      </div>
    </div>
  );
};