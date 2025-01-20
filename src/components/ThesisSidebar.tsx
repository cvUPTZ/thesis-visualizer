import React from 'react';
import { Section, Chapter } from '@/types/thesis';
import { ScrollArea } from './ui/scroll-area';
import { TableOfContents } from './thesis/sidebar/TableOfContents';
import { cn } from '@/lib/utils';

export interface ThesisSidebarProps {
  sections: Section[];
  chapters?: Chapter[];
  activeSection: string;
  onSectionSelect: (id: string) => void;
  className?: string;
}

export const ThesisSidebar: React.FC<ThesisSidebarProps> = ({
  sections,
  chapters,
  activeSection,
  onSectionSelect,
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