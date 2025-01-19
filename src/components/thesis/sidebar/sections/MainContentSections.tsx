import React from 'react';
import { Button } from '@/components/ui/button';
import { Section, Chapter, ThesisSectionType } from '@/types/thesis';
import { getSectionsByGroup, getSectionConfig } from '@/utils/sectionTypes';
import { cn } from '@/lib/utils';
import { PlusCircle } from 'lucide-react';

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
          console.log('Adding main content section:', type);
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
      <div className="flex items-center justify-between px-2 py-1">
        <h2 className="font-semibold text-sm">Main Content</h2>
        {onAddChapter && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => {
              console.log('Adding new chapter');
              onAddChapter({
                id: crypto.randomUUID(),
                title: 'New Chapter',
                sections: [],
                part: chapters?.length || 0 + 1,
                figures: [],
                tables: [],
                footnotes: []
              });
            }}
          >
            <PlusCircle className="h-4 w-4" />
          </Button>
        )}
      </div>
      
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
        
        {mainContentTypes
          .filter(config => !existingSectionTypes.has(config.type))
          .map(config => renderAddButton(config.type))}
      </div>
    </div>
  );
};