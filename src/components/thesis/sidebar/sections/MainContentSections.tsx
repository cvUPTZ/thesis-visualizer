import React from 'react';
import { Section, Chapter, ThesisSectionType } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

interface MainContentSectionsProps {
  sections: Section[];
  chapters: Chapter[];
  activeSection: string;
  onSectionSelect: (id: string) => void;
  onChapterSelect?: (id: string) => void;
  onAddSection?: (type: string) => void;
  onAddChapter?: (chapter: Chapter) => void;
  completedSections: string[];
  onSectionComplete?: (id: string, completed: boolean) => void;
  isReadOnly?: boolean;
}

export const MainContentSections: React.FC<MainContentSectionsProps> = ({
  sections,
  chapters,
  activeSection,
  onSectionSelect,
  onChapterSelect,
  onAddSection,
  onAddChapter,
  completedSections,
  onSectionComplete,
  isReadOnly
}) => {
  const handleAddChapter = () => {
    if (onAddChapter) {
      const newChapter: Chapter = {
        id: crypto.randomUUID(),
        title: 'New Chapter',
        content: '',
        sections: [],
        part: chapters.length + 1,
        figures: [],
        tables: [],
        footnotes: []
      };
      onAddChapter(newChapter);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Main Content</h3>
        {!isReadOnly && onAddSection && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={() => onAddSection('chapter')}
          >
            <Plus className="h-4 w-4" />
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
              {!isReadOnly && onSectionComplete && (
                <Checkbox
                  checked={isCompleted}
                  onCheckedChange={(checked) => onSectionComplete(section.id, checked as boolean)}
                  className="h-4 w-4"
                />
              )}
              <button
                onClick={() => onSectionSelect(section.id)}
                className="flex-1 text-left"
              >
                {section.title}
              </button>
            </div>
          );
        })}

        {chapters.map((chapter) => (
          <div
            key={chapter.id}
            className={cn(
              "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm",
              activeSection === chapter.id && "bg-accent text-accent-foreground",
              "hover:bg-accent/50 transition-colors cursor-pointer"
            )}
            onClick={() => onChapterSelect?.(chapter.id)}
          >
            <span className="flex-1">
              Chapter {chapter.part}: {chapter.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};