import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Section } from '@/types/thesis';
import { useToast } from '@/hooks/use-toast';
import { SectionHeader } from './editor/SectionHeader';
import { SectionContent } from './editor/SectionContent';
import { SectionManagers } from './editor/SectionManagers';
import { SectionProps } from '@/types/components';
import { Button } from './ui/button';
import { Plus, ChevronDown, ChevronRight, Edit, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { Card } from './ui/card';
import { cn } from '@/lib/utils';

export const EditorSection: React.FC<SectionProps> = ({
  section,
  isActive,
  onContentChange,
  onTitleChange
}) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  
  console.log('EditorSection rendering with section:', { 
    id: section.id, 
    title: section.title,
    isActive 
  });

  const handleSectionUpdate = useCallback((updatedSection: Section) => {
    console.log('Updating section:', updatedSection);
    try {
      onContentChange(updatedSection.id, updatedSection.content);
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

  const handleAddSection = useCallback((sectionType: string) => {
    const newSection: Section = {
      id: crypto.randomUUID(),
      title: sectionType,
      content: '',
      type: sectionType === 'General Introduction' ? SectionType.GENERAL_INTRODUCTION : 
            sectionType === 'General Conclusion' ? SectionType.GENERAL_CONCLUSION :
            SectionType.CUSTOM,
      order: 0,
      figures: [],
      tables: [],
      citations: [],
      required: sectionType === 'General Introduction' || sectionType === 'General Conclusion',
      references: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    handleSectionUpdate(newSection);
    toast({
      title: "Section Added",
      description: `Added new ${sectionType} section`,
    });
  }, [handleSectionUpdate, toast]);

  const handleAddCustomSection = useCallback(() => {
    const newSection: Section = {
      id: crypto.randomUUID(),
      title: 'Custom Section',
      content: '',
      type: SectionType.CUSTOM,
      order: 0,
      figures: [],
      tables: [],
      citations: [],
      required: false,
      references: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    handleSectionUpdate(newSection);
    toast({
      title: "Success",
      description: `Added new custom section`,
    });
  }, [handleSectionUpdate, toast]);

  // Create a complete Section object from the minimal section data
  const fullSection = useMemo(() => ({
    ...section,
    type: section.type || SectionType.CUSTOM,
    order: section.order || 0,
    figures: section.figures || [],
    tables: section.tables || [],
    citations: section.citations || [],
    required: section.required || false,
    references: section.references || [],
    created_at: section.created_at || new Date().toISOString(),
    updated_at: section.updated_at || new Date().toISOString()
  }), [section]);

  const navigateToEditor = useCallback(() => {
    const thesisId = window.location.pathname.split('/')[2];
    navigate(`/thesis/${thesisId}/sections/${section.id}`);
  }, [navigate, section.id]);

  if (!isActive) return null;

  return (
    <div className="editor-section space-y-4">
      <div className="flex justify-between items-center mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-2">
              <Plus className="h-4 w-4 mr-2" />
              Add Section
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem onClick={() => handleAddSection('Thesis Structure Overview')}>
              Thesis Structure Overview
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddSection('Abstract')}>
              Abstract
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddSection('Acknowledgements')}>
              Acknowledgements
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddSection('Chapter')}>
              New Chapter
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleAddCustomSection}>
              <Settings className="h-4 w-4 mr-2" />
              Custom Section
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card 
        className={cn(
          "p-6 cursor-pointer transition-all duration-200",
          "hover:shadow-md",
          isEditing && "ring-2 ring-primary"
        )}
      >
        <div className="flex items-center justify-between">
          <SectionHeader
            title={fullSection.title}
            required={fullSection.required}
            onTitleChange={(title) => onTitleChange(fullSection.id, title)}
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
              content={fullSection.content}
              onContentChange={(content) => onContentChange(fullSection.id, content)}
            />
            <SectionManagers
              section={fullSection}
              onSectionUpdate={handleSectionUpdate}
            />
          </div>
        )}
      </Card>
    </div>
  );
};