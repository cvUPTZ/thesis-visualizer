import React from 'react';
import { Section, Chapter, SectionTypes } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChapterCreationDialog } from '@/components/editor/chapters/ChapterCreationDialog';

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
  const [showChapterDialog, setShowChapterDialog] = React.useState(false);
  const [selectedPart, setSelectedPart] = React.useState<number>(0);

  const handleAddChapter = (part: number) => {
    setSelectedPart(part);
    setShowChapterDialog(true);
  };

  const renderChapterSection = (title: string, partNumber: number) => (
    <div className="pl-4 space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm text-muted-foreground">{title}</h4>
        {onAddChapter && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => handleAddChapter(partNumber)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>
      {chapters
        .filter(chapter => chapter.part === partNumber)
        .map(chapter => (
          <button
            key={chapter.id}
            onClick={() => onSectionSelect(chapter.id)}
            className={cn(
              "flex-1 text-left px-2 py-1 rounded-sm hover:bg-accent w-full",
              activeSection === chapter.id && "bg-accent"
            )}
          >
            {chapter.title}
          </button>
        ))}
    </div>
  );

  // Find introduction and conclusion sections
  const introSection = sections.find(s => s.type === SectionTypes.Introduction);
  const conclusionSection = sections.find(s => s.type === SectionTypes.Conclusion);

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-sm px-2">Main Content</h3>
      
      {/* Introduction Section */}
      <div className="pl-4 space-y-2">
        <h4 className="text-sm text-muted-foreground">Introduction</h4>
        <button
          onClick={() => introSection && onSectionSelect(introSection.id)}
          className={cn(
            "flex-1 text-left px-2 py-1 rounded-sm hover:bg-accent w-full",
            introSection && activeSection === introSection.id && "bg-accent",
            !introSection && "opacity-50 cursor-not-allowed"
          )}
        >
          {introSection?.title || "General Introduction"}
        </button>
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
        <button
          onClick={() => conclusionSection && onSectionSelect(conclusionSection.id)}
          className={cn(
            "flex-1 text-left px-2 py-1 rounded-sm hover:bg-accent w-full",
            conclusionSection && activeSection === conclusionSection.id && "bg-accent",
            !conclusionSection && "opacity-50 cursor-not-allowed"
          )}
        >
          {conclusionSection?.title || "General Conclusion"}
        </button>
      </div>

      <ChapterCreationDialog
        open={showChapterDialog}
        onOpenChange={setShowChapterDialog}
        onChapterCreate={(chapter) => {
          if (onAddChapter) {
            onAddChapter();
          }
          setShowChapterDialog(false);
        }}
      />
    </div>
  );
};