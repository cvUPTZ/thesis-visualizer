import React from 'react';
import { Button } from '@/components/ui/button';
import { Section, Chapter, ThesisSectionType } from '@/types/thesis';
import { getSectionsByGroup, getSectionConfig } from '@/utils/sectionTypes';
import { cn } from '@/lib/utils';
import { PlusCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface MainContentSectionsProps {
  sections: Section[];
  chapters: Chapter[];
  activeSection: string;
  onSectionSelect: (id: string) => void;
  onAddSection?: (type: ThesisSectionType) => void;
  onAddChapter?: (chapter: Chapter) => void;
}

export const MainContentSections: React.FC<MainContentSectionsProps> = ({
  sections,
  chapters,
  activeSection,
  onSectionSelect,
  onAddSection,
  onAddChapter
}) => {
  console.log('MainContentSections rendering with:', { 
    sectionsCount: sections?.length,
    chaptersCount: chapters?.length,
    activeSection,
    sections: sections?.map(s => ({ id: s.id, title: s.title, type: s.type }))
  });

  const mainContentTypes = getSectionsByGroup('mainContent');
  const existingSectionTypes = new Set(sections.map(s => s.type));

  const handleAddChapter = () => {
    console.log('Adding new chapter');
    if (onAddChapter) {
      const newChapter: Chapter = {
        id: crypto.randomUUID(),
        title: 'New Chapter',
        sections: [],
        content: '',
        part: (chapters?.length || 0) + 1,
        figures: [],
        tables: [],
        footnotes: []
      };
      onAddChapter(newChapter);
    }
  };

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between px-2 py-1">
        <h2 className="font-semibold text-sm">Main Content</h2>
        {onAddChapter && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 hover:bg-primary/5"
                  onClick={handleAddChapter}
                >
                  <PlusCircle className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add new chapter</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
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
        
        {mainContentTypes
          .filter(config => !existingSectionTypes.has(config.type as ThesisSectionType))
          .map(config => (
            <TooltipProvider key={`add-${config.type}`}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-primary/5 gap-2 group"
                    onClick={() => onAddSection?.(config.type as ThesisSectionType)}
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