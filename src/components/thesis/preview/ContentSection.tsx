import React from 'react';
import { Section, Figure, Table, Citation } from '@/types/thesis';
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
}

export const ContentSection = ({ section, chapterTitle, elementPositions }: ContentSectionProps) => {
  const isSpecialSection = section.type === 'references' || section.type === 'table-of-contents';

  return (
    <div key={section.id} className={cn(
      "thesis-page relative mb-8 p-8",
      isSpecialSection && "special-section",
      section.type === 'table-of-contents' && "toc-section"
    )}>
      <div className="thesis-header">
        {chapterTitle ? `Chapter ${chapterTitle} - ${section.title}` : section.title}
      </div>
      <div className={cn(
        "thesis-content",
        section.type === 'references' && "thesis-references",
        "prose prose-sm max-w-none space-y-6"
      )}>
        {section.type !== 'table-of-contents' && (
          <>
            {chapterTitle && <h2 className="text-2xl font-serif mb-4 page-break-after-avoid">{section.title}</h2>}
            <div className="page-break-inside-avoid">
              <MDEditor.Markdown source={section.content} />
            </div>
            
            <ContentElements
              figures={section.figures}
              tables={section.tables}
              citations={section.citations}
              elementPositions={elementPositions}
            />
          </>
        )}
        {section.type === 'table-of-contents' && (
          <div className="toc-content page-break-inside-avoid">
            <h2 className="text-2xl font-serif mb-4">Table of Contents</h2>
          </div>
        )}
      </div>
      <div className="thesis-footer">
        {!isSpecialSection && <span>Page <span className="page-number"></span></span>}
      </div>
    </div>
  );
};