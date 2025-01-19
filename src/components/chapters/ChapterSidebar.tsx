import React from 'react';
import { Chapter } from '@/types/thesis';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChapterManager } from '@/components/ChapterManager';

interface ChapterSidebarProps {
  chapters: Chapter[];
  onUpdateChapter: (chapter: Chapter) => void;
  onAddChapter: (chapter: Chapter) => void;
  thesisId: string;
}

export const ChapterSidebar: React.FC<ChapterSidebarProps> = ({
  chapters,
  onUpdateChapter,
  onAddChapter,
  thesisId
}) => {
  console.log('Rendering ChapterSidebar with:', { 
    chaptersCount: chapters?.length,
    thesisId 
  });

  return (
    <div className="w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <ScrollArea className="h-full py-6">
        <div className="px-2">
          <ChapterManager
            chapters={chapters}
            onUpdateChapter={onUpdateChapter}
            onAddChapter={onAddChapter}
          />
        </div>
      </ScrollArea>
    </div>
  );
};