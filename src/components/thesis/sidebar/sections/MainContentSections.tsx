import React from 'react';
import { Section, Chapter } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MainContentProps {
  sections: Section[];
  chapters: Chapter[];
  onSectionSelect: (id: string) => void;
  activeSection: string;
  onAddSection?: (type: string) => void;
  onAddChapter?: () => void;
}

export const MainContentSections: React.FC<MainContentProps> = ({
  sections,
  chapters,
  onSectionSelect,
  activeSection,
  onAddSection,
  onAddChapter
}) => {
  const renderChapterSection = (title: string, partNumber: number) => (
    <div className="pl-4 space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm text-muted-foreground">{title}</h4>
        {onAddChapter && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onAddChapter()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );

  // Find introduction and conclusion sections
  const introSection = sections.find(s => s.type === 'general-introduction');
  const conclusionSection = sections.find(s => s.type === 'conclusion');

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-sm px-2">Main Content</h3>
      
      {/* Introduction Section */}
      <div className="pl-4 space-y-2">
        <h4 className="text-sm text-muted-foreground">Introduction</h4>
        {introSection && (
          <button
            onClick={() => onSectionSelect(introSection.id)}
            className={cn(
              "flex-1 text-left px-2 py-1 rounded-sm hover:bg-accent w-full",
              activeSection === introSection.id && "bg-accent"
            )}
          >
            {introSection.title || "General Introduction"}
          </button>
        )}
      </div>

      {/* Literature Review Part */}
      {renderChapterSection("Part One: Literature Review", 1)}
      
      {/* Methodology Part */}
      {renderChapterSection("Part Two: Methodology", 2)}
      
      {/* Results and Discussion Part */}
      {renderChapterSection("Part Three: Results and Discussion", 3)}
      
      {/* Conclusion Section */}
      <div className="pl-4 space-y-2">
        <h4 className="text-sm text-muted-foreground">Conclusion</h4>
        {conclusionSection && (
          <button
            onClick={() => onSectionSelect(conclusionSection.id)}
            className={cn(
              "flex-1 text-left px-2 py-1 rounded-sm hover:bg-accent w-full",
              activeSection === conclusionSection.id && "bg-accent"
            )}
          >
            {conclusionSection.title || "General Conclusion"}
          </button>
        )}
      </div>
    </div>
  );
};