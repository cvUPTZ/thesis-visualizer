import React from 'react';
import { Section, Chapter } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen, FileText, FlaskConical, LineChart, BookmarkPlus, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChapterCreationDialog } from '@/components/editor/chapters/ChapterCreationDialog';
import { SectionTypes } from '@/types/thesis';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';

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

  const introSection = sections.find(s => s.type === SectionTypes.introduction);
  const conclusionSection = sections.find(s => s.type === SectionTypes.conclusion);

  const handleCreateChapter = (chapter: Chapter) => {
    if (onAddChapter) {
      console.log('Creating new chapter for part:', selectedPart);
      const newChapter = {
        ...chapter,
        part: selectedPart,
        order: chapters.filter(c => c.part === selectedPart).length + 1
      };
      onAddChapter(newChapter);
      setShowChapterDialog(false);
    }
  };

  const handleAddChapter = (part: number) => {
    console.log('Opening chapter dialog for part:', part);
    setSelectedPart(part);
    setShowChapterDialog(true);
  };

  const renderChapterSection = (title: string, partNumber: number, description: string, icon: React.ReactNode) => {
    const partChapters = chapters.filter(chapter => chapter.part === partNumber);
    
    return (
      <div className="space-y-2 border-l-2 border-primary/10 pl-4 py-3 hover:border-primary/30 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {icon}
            <div>
              <h4 className="text-sm font-medium text-foreground">{title}</h4>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </div>
          {onAddChapter && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-primary/5"
                    onClick={() => handleAddChapter(partNumber)}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Add Chapter to {title}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Add new chapter to {title}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
        <ScrollArea className="max-h-[200px]">
          <div className="space-y-1 mt-2">
            {partChapters.map((chapter, index) => (
              <button
                key={`${chapter.id}-${index}`}
                onClick={() => onSectionSelect(chapter.id)}
                className={cn(
                  "flex w-full items-center rounded-md px-3 py-1.5 text-sm transition-colors",
                  "hover:bg-primary/5",
                  activeSection === chapter.id && "bg-primary/10 text-primary font-medium"
                )}
              >
                <BookmarkPlus className="mr-2 h-4 w-4 opacity-70" />
                {chapter.title}
              </button>
            ))}
            {partChapters.length === 0 && (
              <p className="text-xs text-muted-foreground italic px-3 py-1">
                No chapters yet
              </p>
            )}
          </div>
        </ScrollArea>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="px-3">
        <h3 className="mb-4 text-sm font-semibold text-primary">Main Content</h3>
        
        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
            <FileText className="h-4 w-4" />
            Introduction
          </div>
          {introSection ? (
            <button
              onClick={() => introSection && onSectionSelect(introSection.id)}
              className={cn(
                "flex w-full items-center rounded-md px-3 py-1.5 text-sm transition-colors",
                "hover:bg-primary/5",
                introSection && activeSection === introSection.id && "bg-primary/10 text-primary font-medium"
              )}
            >
              {introSection.title}
            </button>
          ) : (
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-primary/5"
              onClick={() => onAddSection?.(SectionTypes.introduction)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add General Introduction
            </Button>
          )}
        </div>

        <ScrollArea className="h-[calc(100vh-400px)]">
          {renderChapterSection(
            "Literature Review",
            1,
            "Theoretical framework and state of the art",
            <BookOpen className="h-4 w-4 text-primary/70" />
          )}
          
          {renderChapterSection(
            "Methodology",
            2,
            "Research design and data collection",
            <FlaskConical className="h-4 w-4 text-primary/70" />
          )}
          
          {renderChapterSection(
            "Results & Discussion",
            3,
            "Findings analysis and interpretation",
            <LineChart className="h-4 w-4 text-primary/70" />
          )}

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
              <FileText className="h-4 w-4" />
              Conclusion
            </div>
            {conclusionSection ? (
              <button
                onClick={() => conclusionSection && onSectionSelect(conclusionSection.id)}
                className={cn(
                  "flex w-full items-center rounded-md px-3 py-1.5 text-sm transition-colors",
                  "hover:bg-primary/5",
                  conclusionSection && activeSection === conclusionSection.id && "bg-primary/10 text-primary font-medium"
                )}
              >
                {conclusionSection.title}
              </button>
            ) : (
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-primary/5"
                onClick={() => onAddSection?.(SectionTypes.conclusion)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add General Conclusion
              </Button>
            )}
          </div>
        </ScrollArea>
      </div>

      <ChapterCreationDialog
        open={showChapterDialog}
        onOpenChange={setShowChapterDialog}
        onChapterCreate={handleCreateChapter}
      />
    </div>
  );
};