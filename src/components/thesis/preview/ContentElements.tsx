import React from 'react';
import { Figure, Table, Citation } from '@/types/thesis';
import { cn } from '@/lib/utils';

interface ContentElementsProps {
  figures?: Figure[];
  tables?: Table[];
  citations?: Citation[];
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

export const ContentElements = ({
  figures,
  tables,
  citations,
  elementPositions
}: ContentElementsProps) => {
  const getElementPosition = (elementId: string) => {
    const position = elementPositions.find(p => p.id === elementId);
    return position?.position || 'inline';
  };

  const renderFigures = (position: string = 'inline') => {
    if (!figures || figures.length === 0) return null;
    
    const positionedFigures = figures.filter(figure => 
      getElementPosition(figure.id) === position
    );

    if (positionedFigures.length === 0) return null;

    return (
      <div className="figures-container space-y-8 my-8">
        {positionedFigures.map((figure) => (
          <figure 
            key={figure.id} 
            className={cn(
              "text-center page-break-inside-avoid",
              position === 'custom' && "absolute"
            )}
            style={
              position === 'custom' 
                ? {
                    top: elementPositions.find(p => p.id === figure.id)?.customPosition?.y,
                    left: elementPositions.find(p => p.id === figure.id)?.customPosition?.x,
                  }
                : undefined
            }
          >
            <img 
              src={figure.imageUrl} 
              alt={figure.altText}
              className="mx-auto max-w-full h-auto rounded-lg shadow-md"
            />
            <figcaption className="mt-4 text-sm text-gray-600 italic">
              Figure {figure.number}: {figure.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    );
  };

  const renderTables = (position: string = 'inline') => {
    if (!tables || tables.length === 0) return null;

    const positionedTables = tables.filter(table => 
      getElementPosition(table.id) === position
    );

    if (positionedTables.length === 0) return null;

    return positionedTables.map((table) => (
      <div 
        key={table.id} 
        className={cn(
          "my-8 page-break-inside-avoid",
          position === 'custom' && "absolute"
        )}
        style={
          position === 'custom'
            ? {
                top: elementPositions.find(p => p.id === table.id)?.customPosition?.y,
                left: elementPositions.find(p => p.id === table.id)?.customPosition?.x,
              }
            : undefined
        }
      >
        <div className="overflow-x-auto">
          <div dangerouslySetInnerHTML={{ __html: table.content }} />
        </div>
        {table.caption && (
          <p className="mt-2 text-sm text-gray-600 text-center">
            Table {table.id}: {table.caption}
          </p>
        )}
      </div>
    ));
  };

  const renderCitations = (position: string = 'inline') => {
    if (!citations || citations.length === 0) return null;

    const positionedCitations = citations.filter(citation => 
      getElementPosition(citation.id) === position
    );

    if (positionedCitations.length === 0) return null;

    return (
      <div className={cn(
        "citations-section mt-8 border-t pt-4 page-break-inside-avoid",
        position === 'custom' && "absolute"
      )}>
        <h3 className="text-lg font-serif mb-2">Citations</h3>
        <div className="space-y-2">
          {positionedCitations.map((citation) => (
            <div 
              key={citation.id} 
              className="citation-reference text-sm"
              style={
                position === 'custom'
                  ? {
                      top: elementPositions.find(p => p.id === citation.id)?.customPosition?.y,
                      left: elementPositions.find(p => p.id === citation.id)?.customPosition?.x,
                    }
                  : undefined
              }
            >
              {citation.authors.join(', ')} ({citation.year}). {citation.text}.
              {citation.journal && ` ${citation.journal}.`}
              {citation.doi && ` DOI: ${citation.doi}`}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {renderFigures('top')}
      {renderTables('top')}
      {renderCitations('top')}
      
      {renderFigures('inline')}
      {renderTables('inline')}
      {renderCitations('inline')}
      
      {renderFigures('bottom')}
      {renderTables('bottom')}
      {renderCitations('bottom')}
      
      {renderFigures('custom')}
      {renderTables('custom')}
      {renderCitations('custom')}
    </>
  );
};