import React from 'react';
import { Button } from '@/components/ui/button';
import { Section, ThesisSectionType } from '@/types/thesis';
import { getSectionsByGroup, getSectionConfig } from '@/utils/sectionTypes';
import { cn } from '@/lib/utils';

interface BackMatterSectionsProps {
  sections: Section[];
  activeSection: string;
  onSectionSelect: (id: string) => void;
  onAddSection?: (type: ThesisSectionType) => void;
}

export const BackMatterSections: React.FC<BackMatterSectionsProps> = ({
  sections,
  activeSection,
  onSectionSelect,
  onAddSection
}) => {
  console.log('BackMatterSections rendering with:', { sections, activeSection });

  const backMatterTypes = getSectionsByGroup('backMatter');
  const existingSectionTypes = new Set(sections.map(s => s.type));

  const renderAddButton = (type: ThesisSectionType) => {
    const config = getSectionConfig(type);
    const Icon = config.icon;

    return (
      <Button
        key={`add-${type}`}
        variant="ghost"
        size="sm"
        className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-primary/5 gap-2"
        onClick={() => {
          console.log('Adding back matter section:', type);
          onAddSection?.(type);
        }}
      >
        <Icon className="h-4 w-4" />
        Add {config.label}
      </Button>
    );
  };

  return (
    <div className="space-y-1">
      <h2 className="font-semibold text-sm px-2 py-1">Back Matter</h2>
      <div className="space-y-1">
        {sections.map((section) => {
          const config = getSectionConfig(section.type);
          const Icon = config.icon;
          
          return (
            <Button
              key={section.id}
              variant="ghost"
              size="sm"
              className={cn(
                "w-full justify-start gap-2",
                activeSection === section.id
                  ? "bg-primary/10 text-primary hover:bg-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
              )}
              onClick={() => onSectionSelect(section.id)}
            >
              <Icon className="h-4 w-4" />
              {section.title}
            </Button>
          );
        })}
        
        {backMatterTypes
          .filter(config => !existingSectionTypes.has(config.type))
          .map(config => renderAddButton(config.type))}
      </div>
    </div>
  );
};