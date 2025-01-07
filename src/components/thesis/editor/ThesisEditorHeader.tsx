import React from 'react';
import { ThesisToolbar } from '../ThesisToolbar';
import { NotificationCenter } from '../../collaboration/NotificationCenter';
import { Thesis } from '@/types/thesis';

interface ThesisEditorHeaderProps {
  thesis: Thesis;
  showPreview: boolean;
  onTogglePreview: () => void;
}

export const ThesisEditorHeader: React.FC<ThesisEditorHeaderProps> = ({
  thesis,
  showPreview,
  onTogglePreview
}) => {
  console.log('🎯 Rendering ThesisEditorHeader with thesis:', thesis?.id);
  
  return (
    <div className="flex justify-between items-center">
      <ThesisToolbar
        thesisId={thesis?.id || ''}
        thesisData={thesis}
        showPreview={showPreview}
        onTogglePreview={onTogglePreview}
      />
      {thesis?.id && <NotificationCenter thesisId={thesis.id} />}
    </div>
  );
};