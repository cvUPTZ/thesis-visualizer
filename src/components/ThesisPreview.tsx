import React, { useState } from 'react';
import { Thesis, Section } from '@/types/thesis';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ElementPositionManager } from './thesis/preview/ElementPositionManager';
import { TitlePage } from './thesis/preview/TitlePage';
import { AbstractSection } from './thesis/preview/AbstractSection';
import { ContentSection } from './thesis/preview/ContentSection';

interface ThesisPreviewProps {
  thesis: Thesis;
}

interface ElementPosition {
  id: string;
  type: 'figure' | 'table' | 'citation';
  position: 'inline' | 'top' | 'bottom' | 'custom';
  customPosition?: {
    x: number;
    y: number;
  };
}

export const ThesisPreview = ({ thesis }: ThesisPreviewProps) => {
  const [elementPositions, setElementPositions] = useState<ElementPosition[]>([]);
  console.log('Rendering ThesisPreview with data:', thesis);

  const titleSection = thesis.frontMatter.find(section => section.type === 'title');
  const abstractSection = thesis.frontMatter.find(section => section.type === 'abstract');

  const handleUpdatePosition = (elementId: string, position: ElementPosition) => {
    setElementPositions(prev => {
      const existing = prev.findIndex(p => p.id === elementId);
      if (existing !== -1) {
        const newPositions = [...prev];
        newPositions[existing] = position;
        return newPositions;
      }
      return [...prev, position];
    });
  };

  const renderSection = (section: Section, chapterTitle?: string) => {
    if (!section) return null;

    if (section.type === 'title') {
      return <TitlePage metadata={thesis.metadata} titleSection={titleSection} />;
    }

    if (section.type === 'abstract') {
      return <AbstractSection abstractSection={abstractSection} />;
    }

    return (
      <ContentSection
        key={section.id}
        section={section}
        chapterTitle={chapterTitle}
        elementPositions={elementPositions}
      />
    );
  };

  return (
    <div className="h-full flex flex-col">
      <ElementPositionManager
        figures={thesis.chapters.flatMap(chapter => 
          chapter.sections.flatMap(section => section.figures || [])
        )}
        tables={thesis.chapters.flatMap(chapter => 
          chapter.sections.flatMap(section => section.tables || [])
        )}
        citations={thesis.chapters.flatMap(chapter => 
          chapter.sections.flatMap(section => section.citations || [])
        )}
        onUpdatePosition={handleUpdatePosition}
      />
      
      <ScrollArea className="flex-1 border rounded-md">
        <div className="thesis-preview-container p-4">
          <div className="thesis-preview space-y-6">
            {thesis.frontMatter.map((section) => renderSection(section))}
            {thesis.chapters.map((chapter) => (
              <div key={chapter.id} className="chapter-content">
                {chapter.sections.map((section) => (
                  renderSection(section, chapter.title)
                ))}
              </div>
            ))}
            {thesis.backMatter.map((section) => renderSection(section))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};