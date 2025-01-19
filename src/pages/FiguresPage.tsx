import React from 'react';
import { FigureManager } from '@/components/FigureManager';
import { Figure } from '@/types/thesis';

const FiguresPage = () => {
  const handleAddFigure = (figure: Figure) => {
    console.log('Adding figure:', figure);
  };

  const handleRemoveFigure = (id: string) => {
    console.log('Removing figure:', id);
  };

  const handleUpdateFigure = (figure: Figure) => {
    console.log('Updating figure:', figure);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Figures</h1>
      <FigureManager
        figures={[]}
        onAddFigure={handleAddFigure}
        onRemoveFigure={handleRemoveFigure}
        onUpdateFigure={handleUpdateFigure}
      />
    </div>
  );
};

export default FiguresPage;