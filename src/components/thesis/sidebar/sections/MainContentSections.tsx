import React from 'react';
import { Section, Chapter } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { getSectionConfig } from '@/utils/sectionTypes';

interface MainContentSectionsProps {
  sections: Section[];
  chapters: Chapter[];
  activeSection: string;
  onSectionSelect: (id: string) => void;
  onAddSection?: (type: string) => void;
  onAddChapter?: (chapter: Chapter) => void;
  completedSections: string[];
  onSectionComplete: (id: string, completed: boolean) => void;
  isReadOnly?: boolean;
}

export const MainContentSections: React.FC<MainContentSectionsProps> = ({
  sections,
  activeSection,
  onSectionSelect,
  onAddSection,
  onAddChapter,
  completedSections,
  onSectionComplete,
  isReadOnly = false
}) => {
  const handleSectionClick = (id: string) => {
    onSectionSelect(id);
  };

  return (
    <div className="px-3">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Main Content</h2>
        {!isReadOnly && (
          <div className="space-x-2">
            {onAddSection && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAddSection('introduction')}
                className="h-8 px-2"
              >
                <PlusCircle className="h-4 w-4" />
                <span className="sr-only">Add Section</span>
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="space-y-1">
        {sections.map((section) => {
          const config = getSectionConfig(section.type);
          const isCompleted = completedSections.includes(section.id);
          
          return (
            <div
              key={section.id}
              className={cn(
                "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm",
                activeSection === section.id && "bg-accent text-accent-foreground",
                "hover:bg-accent/50 transition-colors cursor-pointer"
              )}
              onClick={() => handleSectionClick(section.id)}
            >
              {!isReadOnly && (
                <Checkbox
                  checked={isCompleted}
                  onCheckedChange={(checked) => onSectionComplete(section.id, checked as boolean)}
                  className="h-4 w-4"
                  onClick={(e) => e.stopPropagation()}
                />
              )}
              <span className={cn(
                "flex-1",
                isCompleted && "line-through opacity-50"
              )}>
                {config?.icon && <config.icon className="h-4 w-4 inline-block mr-2" />}
                {section.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};