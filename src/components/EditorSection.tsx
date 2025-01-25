import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Section, SectionType } from '@/types/thesis';
import { useToast } from '@/hooks/use-toast';
import { SectionHeader } from './editor/SectionHeader';
import { SectionContent } from './editor/SectionContent';
import { SectionManagers } from './editor/SectionManagers';
import { Button } from './ui/button';
import { Plus, ChevronDown, ChevronRight, Edit } from 'lucide-react';
import { Card } from './ui/card';
import { cn } from '@/lib/utils';

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
    try {
      if (typeof updatedSection.content === 'string') {
        onContentChange(updatedSection.id, updatedSection.content);
      } else {
        onContentChange(updatedSection.id, updatedSection.content.map(item => item.content).join('\n\n'));
      }
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
  }, [onContentChange, toast]);

  const navigateToEditor = useCallback(() => {
    const thesisId = window.location.pathname.split('/')[2];
    navigate(`/thesis/${thesisId}/sections/${section.id}`);
  }, [navigate, section.id]);

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
        <div className="flex items-center justify-between">
          <SectionHeader
            title={section.title}
            required={section.required}
            onTitleChange={(title) => onTitleChange(section.id, title)}
          />
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(!isEditing);
              }}
            >
              {isEditing ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
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
        </div>

        {isEditing && (
          <div className="mt-4 space-y-6">
            <SectionContent
              content={section.content}
              onContentChange={(content) => onContentChange(section.id, content)}
            />
            <SectionManagers
              section={section}
              onSectionUpdate={handleSectionUpdate}
            />
          </div>
        )}
      </Card>
    </div>
  );
};