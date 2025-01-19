import React from 'react';
import { Section, Chapter } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChapterCreationDialog } from '@/components/editor/chapters/ChapterCreationDialog';
import { SectionTypes } from '@/types/thesis';

interface MainContentProps {
  sections: Section[];
  chapters: Chapter[];
  onSectionSelect: (id: string) => void;
  activeSection: string;
  onAddSection?: (type: string) => void;
  onAddChapter?: (chapter: Chapter) => void;
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

  console.log('Rendering MainContentSections with:', { 
    sectionsCount: sections.length,
    chaptersCount: chapters.length,
    activeSection 
  });

  // Find introduction and conclusion sections
  const introSection = sections.find(s => s.type === SectionTypes.introduction);
  const conclusionSection = sections.find(s => s.type === SectionTypes.conclusion);

  const handleCreateChapter = (chapter: Chapter) => {
    console.log('Creating chapter with part:', selectedPart);
    if (onAddChapter) {
      const newChapter = {
        ...chapter,
        part: selectedPart
      };
      onAddChapter(newChapter);
      setShowChapterDialog(false);
    }
  };

  const handleAddChapter = (part: number) => {
    setSelectedPart(part);
    setShowChapterDialog(true);
  };

  const renderChapterSection = (title: string, partNumber: number, description: string) => (
    <div className="space-y-2 border-l-2 border-muted pl-4 py-2">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium text-foreground">{title}</h4>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        {onAddChapter && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => handleAddChapter(partNumber)}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add Chapter</span>
          </Button>
        )}
      </div>
      <div className="space-y-1">
        {chapters
          .filter(chapter => chapter.part === partNumber)
          .map(chapter => (
            <button
              key={chapter.id}
              onClick={() => onSectionSelect(chapter.id)}
              className={cn(
                "flex w-full items-center rounded-md px-2 py-1.5 text-sm hover:bg-accent",
                activeSection === chapter.id && "bg-accent text-accent-foreground font-medium"
              )}
            >
              {chapter.title}
            </button>
          ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="px-2">
        <h3 className="mb-4 text-sm font-semibold">Main Content</h3>
        
        {/* Introduction Section */}
        <div className="mb-6 space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Introduction</h4>
          {introSection ? (
            <button
              onClick={() => introSection && onSectionSelect(introSection.id)}
              className={cn(
                "flex w-full items-center rounded-md px-2 py-1.5 text-sm hover:bg-accent",
                introSection && activeSection === introSection.id && "bg-accent text-accent-foreground font-medium"
              )}
            >
              {introSection.title}
            </button>
          ) : (
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
              onClick={() => onAddSection?.(SectionTypes.introduction)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add General Introduction
            </Button>
          )}
        </div>

        {/* Literature Review Part */}
        {renderChapterSection(
          "Literature Review",
          1,
          "Theoretical framework and state of the art"
        )}
        
        {/* Methodology Part */}
        {renderChapterSection(
          "Methodology",
          2,
          "Research design and data collection"
        )}
        
        {/* Results and Discussion Part */}
        {renderChapterSection(
          "Results & Discussion",
          3,
          "Findings analysis and interpretation"
        )}

        {/* Conclusion Section */}
        <div className="mt-6 space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Conclusion</h4>
          {conclusionSection ? (
            <button
              onClick={() => conclusionSection && onSectionSelect(conclusionSection.id)}
              className={cn(
                "flex w-full items-center rounded-md px-2 py-1.5 text-sm hover:bg-accent",
                conclusionSection && activeSection === conclusionSection.id && "bg-accent text-accent-foreground font-medium"
              )}
            >
              {conclusionSection.title}
            </button>
          ) : (
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
              onClick={() => onAddSection?.(SectionTypes.conclusion)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add General Conclusion
            </Button>
          )}
        </div>
      </div>

      <ChapterCreationDialog
        open={showChapterDialog}
        onOpenChange={setShowChapterDialog}
        onChapterCreate={handleCreateChapter}
      />
    </div>
  );
};