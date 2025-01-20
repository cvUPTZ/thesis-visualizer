import React from 'react';
import { Section } from '@/types/thesis';
import { useToast } from '@/hooks/use-toast';
import { SectionHeader } from './editor/SectionHeader';
import { SectionContent } from './editor/SectionContent';
import { SectionManagers } from './editor/SectionManagers';
import { SectionProps } from '@/types/components';
import { Button } from './ui/button';
import { Plus, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

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

  const handleAddSection = (sectionType: string) => {
    const newSection: Section = {
      id: crypto.randomUUID(),
      title: sectionType,
      content: '',
      type: 'custom',
      order: 0,
      figures: [],
      tables: [],
      citations: [],
      required: false,
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
    type: 'custom',
    order: 0,
    figures: [],
    tables: [],
    citations: [],
    required: false,
    references: []
  };

  return (
    <div className="editor-section">
      <div className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <SectionHeader
            title={fullSection.title}
            required={fullSection.required}
            onTitleChange={(title) => onTitleChange(fullSection.id, title)}
          />
          
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