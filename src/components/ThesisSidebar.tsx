import React from 'react';
import { Section, Chapter } from '@/types/thesis';
import { ScrollArea } from './ui/scroll-area';
import { TableOfContents } from './thesis/sidebar/TableOfContents';
import { cn } from '@/lib/utils';
import { ChapterManager } from './ChapterManager';

export interface ThesisSidebarProps {
  sections: Section[];
  chapters?: Chapter[];
  activeSection: string;
  onSectionSelect: (id: string) => void;
  onUpdateChapter?: (chapter: Chapter) => void;
  onAddChapter?: (chapter: Chapter) => void;
  className?: string;
}

export const ThesisSidebar: React.FC<ThesisSidebarProps> = ({
  sections,
  chapters,
  activeSection,
  onSectionSelect,
  onUpdateChapter,
  onAddChapter,
  className
}) => {
  console.log('Rendering ThesisSidebar with:', { 
    sectionsCount: sections?.length,
    chaptersCount: chapters?.length,
    activeSection 
  });

  const handleChapterSelect = (chapterId: string) => {
    console.log('Chapter selected:', chapterId);
    onSectionSelect(chapterId);
  };

  return (
    <div className={cn(
      "w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      <ScrollArea className="h-full py-6">
        {chapters && onUpdateChapter && onAddChapter && (
          <div className="px-4 mb-6">
            <ChapterManager
              chapters={chapters}
              onUpdateChapter={onUpdateChapter}
              onAddChapter={onAddChapter}
            />
          </div>
        )}
        <TableOfContents
          sections={sections}
          chapters={chapters}
          activeSection={activeSection}
          onSectionSelect={onSectionSelect}
          onChapterSelect={handleChapterSelect}
          isReadOnly={true}
        />
      </ScrollArea>
    </div>
  );
};