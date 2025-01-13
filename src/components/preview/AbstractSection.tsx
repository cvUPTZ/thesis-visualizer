import React from 'react';
import { Section } from '@/types/thesis';
import MDEditor from '@uiw/react-md-editor';

interface AbstractSectionProps {
  abstractSection?: Section;
}

export const AbstractSection: React.FC<AbstractSectionProps> = ({ abstractSection }) => {
  return (
    <div className="thesis-page">
      <div className="thesis-header">Abstract</div>
      <div className="thesis-content thesis-abstract">
        <h2 className="text-2xl font-serif mb-4">Abstract</h2>
        <MDEditor.Markdown 
          source={abstractSection?.content || "No Abstract Provided"}
          className="prose prose-sm max-w-none"
        />
      </div>
    </div>
  );
};