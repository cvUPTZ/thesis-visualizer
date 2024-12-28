import React from 'react';
import { Button } from '@/components/ui/button';

interface ThesisHeaderProps {
  showPreview: boolean;
  onTogglePreview: () => void;
}

export const ThesisHeader = ({ showPreview, onTogglePreview }: ThesisHeaderProps) => {
  return (
    <div className="mb-6 flex justify-between items-center">
      <h1 className="text-3xl font-serif text-primary">Thesis Editor</h1>
      <Button variant="outline" onClick={onTogglePreview}>
        {showPreview ? 'Hide Preview' : 'Show Preview'}
      </Button>
    </div>
  );
};