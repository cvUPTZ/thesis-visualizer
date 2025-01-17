import React from 'react';
import { Section } from '@/types/thesis';
import MDEditor from '@uiw/react-md-editor';
import { cn } from '@/lib/utils';
import { ContentElements } from './ContentElements';

interface ContentSectionProps {
  section: Section;
  chapterTitle?: string;
  elementPositions: Array<{
    id: string;
    type: 'figure' | 'table' | 'citation';
    position: 'inline' | 'top' | 'bottom' | 'custom';
    customPosition?: {
      x: number;
      y: number;
    };
  }>;
  onElementClick: (id: string, type: 'figure' | 'table' | 'citation') => void;
  onPositionChange: (elementId: string, position: { x: number; y: number }) => void;
}

export const ContentSection = ({ 
  section, 
  chapterTitle, 
  elementPositions,
  onElementClick,
  onPositionChange 
}: ContentSectionProps) => {
  const isSpecialSection = section.type === 'references' || section.type === 'table-of-contents';

  return (
    <div className="thesis-page">
      <div className="thesis-header">
        {chapterTitle ? `Chapter ${chapterTitle} - ${section.title}` : section.title}
      </div>
      
      <div className={cn(
        "thesis-content",
        section.type === 'references' && "thesis-references",
        "prose prose-sm max-w-none"
      )}>
        {section.type !== 'table-of-contents' && (
          <>
            {chapterTitle && (
              <h2 className="text-2xl font-serif mb-4 break-after-avoid">
                {section.title}
              </h2>
            )}
            <div className="break-inside-avoid">
              <MDEditor.Markdown source={section.content} />
            </div>
            
            <ContentElements
              figures={section.figures}
              tables={section.tables}
              citations={section.citations}
              elementPositions={elementPositions}
              onElementClick={onElementClick}
              onPositionChange={onPositionChange}
            />
          </>
        )}

        {section.type === 'table-of-contents' && (
          <div className="toc-content break-inside-avoid">
            <h2 className="text-2xl font-serif mb-4">Table of Contents</h2>
          </div>
        )}
      </div>

      {section.footnotes && section.footnotes.length > 0 && (
        <div className="thesis-footnotes">
          {section.footnotes.map((footnote) => (
            <div key={footnote.id} className="thesis-footnote">
              {footnote.content}
            </div>
          ))}
        </div>
      )}

      <div className="thesis-footer">
        {!isSpecialSection && <span>Page <span className="page-number"></span></span>}
      </div>
    </div>
  );
};