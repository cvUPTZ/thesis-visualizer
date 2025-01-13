import React from 'react';
import { Section } from '@/types/thesis';
import MDEditor from '@uiw/react-md-editor';

interface AbstractSectionProps {
  abstractSection: Section;
}

export const AbstractSection: React.FC<AbstractSectionProps> = ({ abstractSection }) => {
  return (
    <div className="thesis-content">
      <h2 className="text-2xl font-serif mb-4">Abstract</h2>
      <MDEditor.Markdown 
        source={abstractSection.content}
        className="prose prose-sm max-w-none"
      />
    </div>
  );
};