import React from 'react';
import { Button } from '@/components/ui/button';
import { Section, ThesisSectionType } from '@/types/thesis';
import { getSectionsByGroup, getSectionConfig } from '@/utils/sectionTypes';
import { cn } from '@/lib/utils';
import { PlusCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  console.log('BackMatterSections rendering with:', { 
    sectionsCount: sections?.length,
    activeSection,
    sections: sections?.map(s => ({ id: s.id, title: s.title, type: s.type }))
  });

  const backMatterTypes = getSectionsByGroup('backMatter');
  const existingSectionTypes = new Set(sections.map(s => s.type));

  const handleAddSection = (type: ThesisSectionType) => {
    console.log('Adding back matter section:', type);
    onAddSection?.(type);
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between px-2 py-1">
        <h2 className="font-semibold text-sm">Back Matter</h2>
      </div>
      
      <div className="space-y-1">
        {sections.map((section) => {
          const config = getSectionConfig(section.type);
          const Icon = config.icon;
          
          return (
            <TooltipProvider key={section.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      "w-full justify-start gap-2 group",
                      activeSection === section.id
                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                    )}
                    onClick={() => onSectionSelect(section.id)}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="truncate">{section.title}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{config.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}
        
        {backMatterTypes
          .filter(config => !existingSectionTypes.has(config.type as ThesisSectionType))
          .map(config => (
            <TooltipProvider key={`add-${config.type}`}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-primary/5 gap-2 group"
                    onClick={() => handleAddSection(config.type as ThesisSectionType)}
                  >
                    <PlusCircle className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                    <span>Add {config.label}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{config.description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
      </div>
    </div>
  );
};