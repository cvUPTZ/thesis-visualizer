import React from 'react';
import { Section, ThesisSectionType } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

interface FrontMatterSectionsProps {
  sections: Section[];
  activeSection: string;
  onSectionSelect: (id: string) => void;
  onAddSection?: (type: ThesisSectionType) => void;
  completedSections: string[];
  onSectionComplete: (id: string, completed: boolean) => void;
  isReadOnly?: boolean;
}

export const FrontMatterSections: React.FC<FrontMatterSectionsProps> = ({
  sections,
  activeSection,
  onSectionSelect,
  onAddSection,
  completedSections,
  onSectionComplete,
  isReadOnly = false
}) => {
  return (
    <div className="px-3">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Front Matter</h2>
        {!isReadOnly && onAddSection && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAddSection('acknowledgments')}
            className="h-8 px-2"
          >
            <PlusCircle className="h-4 w-4" />
            <span className="sr-only">Add Section</span>
          </Button>
        )}
      </div>

      <div className="space-y-1">
        {sections.map((section) => {
          const isCompleted = completedSections.includes(section.id);
          
          return (
            <div
              key={section.id}
              className={cn(
                "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm",
                activeSection === section.id && "bg-accent text-accent-foreground",
                "hover:bg-accent/50 transition-colors"
              )}
            >
              {!isReadOnly && (
                <Checkbox
                  checked={isCompleted}
                  onCheckedChange={(checked) => onSectionComplete(section.id, checked as boolean)}
                  className="h-4 w-4"
                />
              )}
              <button
                onClick={() => onSectionSelect(section.id)}
                className={cn(
                  "flex-1 text-left",
                  isCompleted && "line-through opacity-50"
                )}
              >
                {section.title}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};