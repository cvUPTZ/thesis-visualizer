import React from 'react';
import { FileText } from 'lucide-react'; // Import FileText from lucide-react
import { Section, Chapter } from '@/types/thesis';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface TableOfContentsProps {
  sections: Section[];
  activeSection: string;
  onSectionSelect: (id: string) => void;
}

export const TableOfContents = ({ 
  sections = [], 
  activeSection, 
  onSectionSelect 
}: TableOfContentsProps) => {
  console.log('Rendering TableOfContents:', { 
    activeSection, 
    sectionsCount: sections?.length,
    sections: sections?.map(s => ({ id: s.id, title: s.title }))
  });
  
  const validSections = Array.isArray(sections) ? sections.filter(section => 
    section && typeof section === 'object' && 'id' in section && 'title' in section
  ) : [];

  const renderSectionItem = (section: Section) => {
    const isActive = activeSection === section.id;
    
    return (
      <Button
        key={section.id}
        variant={isActive ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start gap-2",
          isActive && "bg-primary/10 text-primary"
        )}
        onClick={() => onSectionSelect(section.id)}
      >
        <FileText className="h-4 w-4" />
        <span className="truncate">{section.title}</span>
      </Button>
    );
  };

  return (
    <div className="space-y-4">
      {validSections.map(renderSectionItem)}
    </div>
  );
};