import React from 'react';
import { Chapter } from '@/types/thesis';

export interface ChapterFiguresProps {
  chapter: Chapter;
  onUpdateChapter: (chapter: Chapter) => void;
}

export const ChapterFigures: React.FC<ChapterFiguresProps> = ({
  chapter,
  onUpdateChapter
}) => {
  return (
    <div>
      {/* Figures management UI will be implemented here */}
      <p className="text-muted-foreground">Figures management coming soon...</p>
    </div>
  );
};
