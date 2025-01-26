import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Section } from '@/types/thesis';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { ChevronDown, ChevronRight, Edit } from 'lucide-react';
import { Card } from './ui/card';
import { cn } from '@/lib/utils';
import { SectionManagerFactory } from './editor/sections/SectionManagerFactory';

interface EditorSectionProps {
  section: Section;
  isActive: boolean;
  onContentChange: (id: string, content: string) => void;
  onTitleChange: (id: string, title: string) => void;
}

export const EditorSection: React.FC<EditorSectionProps> = ({
  section,
  isActive,
  onContentChange,
  onTitleChange
}) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  
  const handleSectionUpdate = useCallback((updatedSection: Section) => {
    if (!updatedSection) return;
    
    try {
      const content = typeof updatedSection.content === 'string' 
        ? updatedSection.content 
        : '';
      
      onContentChange(updatedSection.id, content);
      onTitleChange(updatedSection.id, updatedSection.title);
      
      toast({
        title: "Success",
        description: "Section updated successfully",
      });
    } catch (error) {
      console.error('Error updating section:', error);
      toast({
        title: "Error",
        description: "Failed to update section",
        variant: "destructive"
      });
    }
  }, [onContentChange, onTitleChange, toast]);

  const navigateToEditor = useCallback(() => {
    const thesisId = window.location.pathname.split('/')[2];
    navigate(`/thesis/${thesisId}/sections/${section.id}`);
  }, [navigate, section.id]);

  const toggleEditing = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(prev => !prev);
  }, []);

  if (!isActive) return null;

  return (
    <div className="editor-section space-y-4">
      <Card 
        className={cn(
          "p-6 cursor-pointer transition-all duration-200",
          "hover:shadow-md",
          isEditing && "ring-2 ring-primary"
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleEditing}
            >
              {isEditing ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            <h3 className="text-lg font-medium">{section.title}</h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={navigateToEditor}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit in Full Page
          </Button>
        </div>

        {isEditing && (
          <div className="mt-4">
            <SectionManagerFactory
              section={section}
              onUpdate={handleSectionUpdate}
            />
          </div>
        )}
      </Card>
    </div>
  );
};