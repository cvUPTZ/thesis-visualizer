import React from 'react';
import { Section, Chapter } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

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
  const renderChapterSection = (title: string, chapterNumber: number) => (
    <div className="pl-4 space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-sm text-muted-foreground">{title}</h4>
        {onAddChapter && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={onAddChapter}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-sm px-2">Main Content</h3>
      
      <div className="pl-4 space-y-2">
        <h4 className="text-sm text-muted-foreground">Introduction</h4>
        {['general-introduction', 'general-context', 'problem-statement', 'research-questions', 
          'objectives', 'hypotheses', 'thesis-structure'].map(type => {
          const section = sections.find(s => s.type === type);
          if (section) {
            return (
              <button
                key={section.id}
                onClick={() => onSectionSelect(section.id)}
                className={`flex-1 text-left px-2 py-1 rounded-sm hover:bg-accent w-full ${
                  activeSection === section.id ? 'bg-accent' : ''
                }`}
              >
                {section.title}
              </button>
            );
          }
          return null;
        })}
      </div>

      {renderChapterSection("Part One: Literature Review", 1)}
      {renderChapterSection("Part Two: Methodology", 2)}
      {renderChapterSection("Part Three: Results and Discussion", 3)}
      
      <div className="pl-4 space-y-2">
        <h4 className="text-sm text-muted-foreground">Conclusion</h4>
        {['general-summary', 'main-contributions', 'overall-limitations', 
          'future-perspectives', 'recommendations'].map(type => {
          const section = sections.find(s => s.type === type);
          if (section) {
            return (
              <button
                key={section.id}
                onClick={() => onSectionSelect(section.id)}
                className={`flex-1 text-left px-2 py-1 rounded-sm hover:bg-accent w-full ${
                  activeSection === section.id ? 'bg-accent' : ''
                }`}
              >
                {section.title}
              </button>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};