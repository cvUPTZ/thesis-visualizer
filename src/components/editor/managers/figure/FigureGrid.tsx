import React from 'react';
import { Figure } from '@/types/thesis';
import { FigureCard } from './FigureCard';

interface FigureGridProps {
  figures: Figure[];
  onRemove: (id: string) => void;
  onUpdate: (figure: Figure) => void;
  onPreview: (imageUrl: string) => void;
}

export const FigureGrid = ({ figures, onRemove, onUpdate, onPreview }: FigureGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {figures.map((figure) => (
        <FigureCard
          key={figure.id}
          figure={figure}
          onRemove={onRemove}
          onUpdate={onUpdate}
          onPreview={onPreview}
        />
      ))}
    </div>
  );
};