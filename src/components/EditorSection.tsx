import React, { useState, useCallback } from 'react';
import { Section } from '@/types/thesis';
import { SectionContent } from './editor/content/EditorContent';
import { SectionHeader } from './editor/SectionHeader';
import { SectionManagers } from './editor/SectionManagers';
import { useToast } from '@/hooks/use-toast';

interface EditorSectionProps {
  section: Section;
  onUpdate: (sectionId: string, updates: Partial<Section>) => Promise<void>;
  onDelete: (sectionId: string) => Promise<void>;
}

export const EditorSection: React.FC<EditorSectionProps> = ({
  section,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const handleContentChange = useCallback(
    async (content: string) => {
      try {
        await onUpdate(section.id, { content });
      } catch (error) {
        console.error('Error updating section content:', error);
        toast({
          title: "Error",
          description: "Failed to update section content",
          variant: "destructive",
        });
      }
    },
    [section.id, onUpdate, toast]
  );

  const handleTitleChange = useCallback(
    async (title: string) => {
      try {
        await onUpdate(section.id, { title });
        setIsEditing(false);
      } catch (error) {
        console.error('Error updating section title:', error);
        toast({
          title: "Error",
          description: "Failed to update section title",
          variant: "destructive",
        });
      }
    },
    [section.id, onUpdate, toast]
  );

  const handleDelete = useCallback(async () => {
    try {
      await onDelete(section.id);
    } catch (error) {
      console.error('Error deleting section:', error);
      toast({
        title: "Error",
        description: "Failed to delete section",
        variant: "destructive",
      });
    }
  }, [section.id, onDelete, toast]);

  return (
    <div className="border border-editor-border rounded-lg bg-editor-bg shadow-sm mb-4">
      <SectionHeader
        title={section.title}
        isEditing={isEditing}
        onEditStart={() => setIsEditing(true)}
        onEditComplete={handleTitleChange}
        onDelete={handleDelete}
      />
      <div className="p-4">
        <SectionContent
          content={section.content}
          onChange={handleContentChange}
        />
        <SectionManagers
          section={section}
          onUpdate={handleContentChange}
        />
      </div>
    </div>
  );
};