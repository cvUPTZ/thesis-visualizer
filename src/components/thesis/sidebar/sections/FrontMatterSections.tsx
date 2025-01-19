import React from 'react';
import { Section } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Award, BookOpen, List, Image, Table, FileTerminal } from 'lucide-react';
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
    { type: SectionTypes.title, label: 'Title Page', icon: FileText },
    { type: SectionTypes.acknowledgments, label: 'Acknowledgments', icon: Award },
    { type: SectionTypes.abstract, label: 'Abstract', icon: BookOpen },
    { type: SectionTypes['table-of-contents'], label: 'Table of Contents', icon: List },
    { type: SectionTypes['list-of-figures'], label: 'List of Figures', icon: Image },
    { type: SectionTypes['list-of-tables'], label: 'List of Tables', icon: Table },
    { type: SectionTypes['list-of-abbreviations'], label: 'List of Abbreviations', icon: FileTerminal }
  ];

  const frontMatterSections = sections.filter(s => 
    frontMatterTypes.some(type => type.type === s.type)
  );

  const renderAddButton = (type: string, label: string, Icon: React.ElementType) => {
    if (sections.some(s => s.type === type)) return null;
    
    return (
      <Button
        variant="ghost"
        size="sm"
        className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-primary/5 gap-2"
        onClick={() => onAddSection?.(type)}
      >
        <Plus className="h-4 w-4" />
        <Icon className="h-4 w-4" />
        <span>Add {label}</span>
      </Button>
    );
  };

  return (
    <div className="space-y-4">
      <div className="px-3">
        <h3 className="text-sm font-semibold text-primary mb-4">Front Matter</h3>
        
        <div className="space-y-4">
          {frontMatterSections.map(section => {
            const typeInfo = frontMatterTypes.find(t => t.type === section.type);
            const Icon = typeInfo?.icon || FileText;
            
            return (
              <button
                key={section.id}
                onClick={() => onSectionSelect(section.id)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors",
                  "hover:bg-primary/5",
                  activeSection === section.id && "bg-primary/10 text-primary font-medium"
                )}
              >
                <Icon className="h-4 w-4 opacity-70" />
                {section.title}
              </button>
            );
          })}
          
          <div className="space-y-2 pt-2">
            {frontMatterTypes.map(({ type, label, icon: Icon }) => 
              renderAddButton(type, label, Icon)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};