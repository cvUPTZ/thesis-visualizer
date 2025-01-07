import React from 'react';
import { ThesisPreview } from '../../ThesisPreview';
import { Thesis } from '@/types/thesis';

interface ThesisEditorPreviewProps {
  thesis: Thesis;
  previewRef: React.RefObject<HTMLDivElement>;
}

export const ThesisEditorPreview: React.FC<ThesisEditorPreviewProps> = ({
  thesis,
  previewRef
}) => {
  return (
    <div ref={previewRef}>
      <ThesisPreview thesis={thesis} />
    </div>
  );
};