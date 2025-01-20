import React from 'react';
import { Chapter } from '@/types/thesis';
import { FigureManager } from '../FigureManager';

interface ChapterFiguresProps {
  chapter: Chapter;
  onUpdateChapter: (chapter: Chapter) => void;
}

export const ChapterFigures: React.FC<ChapterFiguresProps> = ({
  chapter,
  onUpdateChapter
}) => {
  const handleAddFigure = (figure) => {
    const updatedFigures = [...chapter.figures, figure];
    onUpdateChapter({ ...chapter, figures: updatedFigures });
  };

  const handleRemoveFigure = (id) => {
    const updatedFigures = chapter.figures.filter(figure => figure.id !== id);
    onUpdateChapter({ ...chapter, figures: updatedFigures });
  };

  const handleUpdateFigure = (updatedFigure) => {
    const updatedFigures = chapter.figures.map(figure =>
      figure.id === updatedFigure.id ? updatedFigure : figure
    );
    onUpdateChapter({ ...chapter, figures: updatedFigures });
  };

  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Figures</h3>
      <FigureManager
        figures={chapter.figures}
        onAddFigure={handleAddFigure}
        onRemoveFigure={handleRemoveFigure}
        onUpdateFigure={handleUpdateFigure}
      />
    </div>
  );
};
