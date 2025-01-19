import React from 'react';
import { Section } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SectionTypes } from '@/types/thesis';

interface FrontMatterProps {
  sections: Section[];
  onSectionSelect: (id: string) => void;
  activeSection: string;
  onAddSection?: (type: string) => void;
}

export const FrontMatterSections: React.FC<FrontMatterProps> = ({
  sections,
  onSectionSelect,
  activeSection,
  onAddSection
}) => {
  const frontMatterTypes = [
    { type: SectionTypes.title, label: 'Title Page' },
    { type: SectionTypes.acknowledgments, label: 'Acknowledgments' },
    { type: SectionTypes.abstract, label: 'Abstract' },
    { type: SectionTypes['table-of-contents'], label: 'Table of Contents' },
    { type: SectionTypes['list-of-figures'], label: 'List of Figures' },
    { type: SectionTypes['list-of-tables'], label: 'List of Tables' },
    { type: SectionTypes['list-of-abbreviations'], label: 'List of Abbreviations' }
  ];

  const frontMatterSections = sections.filter(s => 
    frontMatterTypes.some(type => type.type === s.type)
  );

  const renderAddButton = (type: string, label: string) => {
    if (sections.some(s => s.type === type)) return null;
    
    return (
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start text-muted-foreground hover:text-foreground"
        onClick={() => onAddSection?.(type)}
      >
        <Plus className="mr-2 h-4 w-4" />
        Add {label}
      </Button>
    );
  };

  return (
    <div className="space-y-4">
      <div className="px-2">
        <h3 className="text-sm font-semibold mb-4">Front Matter</h3>
        
        {/* Essential Front Matter */}
        <div className="space-y-2 mb-4">
          <h4 className="text-sm font-medium text-muted-foreground">Essential Pages</h4>
          <div className="space-y-1">
            {renderAddButton(SectionTypes.title, 'Title Page')}
            {renderAddButton(SectionTypes.abstract, 'Abstract')}
            {renderAddButton(SectionTypes['table-of-contents'], 'Table of Contents')}
          </div>
        </div>

        {/* Additional Front Matter */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Additional Pages</h4>
          <div className="space-y-1">
            {renderAddButton(SectionTypes.acknowledgments, 'Acknowledgments')}
            {renderAddButton(SectionTypes['list-of-figures'], 'List of Figures')}
            {renderAddButton(SectionTypes['list-of-tables'], 'List of Tables')}
            {renderAddButton(SectionTypes['list-of-abbreviations'], 'List of Abbreviations')}
          </div>
        </div>

        {/* Existing Sections */}
        <div className="mt-4 space-y-1">
          {frontMatterSections.map(section => (
            <button
              key={section.id}
              onClick={() => onSectionSelect(section.id)}
              className={cn(
                "flex w-full items-center rounded-md px-2 py-1.5 text-sm hover:bg-accent",
                activeSection === section.id && "bg-accent text-accent-foreground font-medium"
              )}
            >
              {section.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
