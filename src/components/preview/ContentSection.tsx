import React from 'react';
import { Section } from '@/types/thesis';
import MDEditor from '@uiw/react-md-editor';

interface ContentSectionProps {
  section: Section;
  chapterTitle?: string;
  elementPositions: any[];
  onElementClick: (id: string) => void;
  onPositionChange: (id: string, position: { x: number; y: number }) => void;
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  section,
  chapterTitle,
  elementPositions,
  onElementClick,
  onPositionChange
}) => {
  return (
    <div className="thesis-content">
      {chapterTitle && (
        <h1 className="text-3xl font-serif mb-6">{chapterTitle}</h1>
      )}
      {section.title && (
        <h2 className="text-2xl font-serif mb-4">{section.title}</h2>
      )}
      <MDEditor.Markdown 
        source={section.content}
        className="prose prose-sm max-w-none"
      />
    </div>
  );
};