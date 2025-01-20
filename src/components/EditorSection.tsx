import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Section } from '@/types/thesis';
import { useToast } from '@/hooks/use-toast';
import { SectionHeader } from './editor/SectionHeader';
import { SectionContent } from './editor/SectionContent';
import { SectionManagers } from './editor/SectionManagers';
import { SectionProps } from '@/types/components';
import { Button } from './ui/button';
import { Plus, ChevronDown, ChevronRight, Edit } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
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

  if (!isActive) return null;

  const handleSectionUpdate = (updatedSection: Section) => {
    console.log('Updating section:', updatedSection);
    onContentChange(updatedSection.id, updatedSection.content);
    
    toast({
      title: "Success",
      description: "Section updated successfully",
    });
  };

  const handleAddSection = (sectionType: string) => {
    const newSection: Section = {
      id: crypto.randomUUID(),
      title: sectionType,
      content: '',
      type: sectionType.toLowerCase().replace(/ /g, '_'),
      order: 0,
      figures: [],
      tables: [],
      citations: [],
      required: sectionType === 'General Introduction' || sectionType === 'General Conclusion',
      references: []
    };

    handleSectionUpdate(newSection);
    toast({
      title: "Section Added",
      description: `Added new ${sectionType} section`,
    });
  };

  // Create a complete Section object from the minimal section data
  const fullSection: Section = {
    id: section.id,
    title: section.title,
    content: section.content,
    type: section.type || 'custom',
    order: section.order || 0,
    figures: section.figures || [],
    tables: section.tables || [],
    citations: section.citations || [],
    required: section.required || false,
    references: section.references || []
  };

  const navigateToEditor = () => {
    const thesisId = window.location.pathname.split('/')[2];
    navigate(`/thesis/${thesisId}/section/${section.id}`);
  };

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
            <DropdownMenuItem onClick={() => handleAddSection('General Introduction')}>
              General Introduction
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddSection('Abstract')}>
              Abstract
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddSection('Acknowledgements')}>
              Acknowledgements
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddSection('General Conclusion')}>
              General Conclusion
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddSection('Chapter')}>
              New Chapter
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