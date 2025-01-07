import React from 'react';
import { Figure, Table, Citation } from '@/types/thesis';
import { cn } from '@/lib/utils';
import { ThesisPreviewElement } from './ThesisPreviewElement';

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
  onElementClick: (id: string, type: 'figure' | 'table' | 'citation') => void;
  onPositionChange: (elementId: string, position: { x: number; y: number }) => void;
}

export const ContentElements = ({
  figures,
  tables,
  citations,
  elementPositions,
  onElementClick,
  onPositionChange
}: ContentElementsProps) => {
  const getElementPosition = (elementId: string) => {
    const position = elementPositions.find(p => p.id === elementId);
    return position?.position || 'inline';
  };

  const getCustomPosition = (elementId: string) => {
    const position = elementPositions.find(p => p.id === elementId);
    return position?.customPosition;
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
          <ThesisPreviewElement
            key={figure.id}
            id={figure.id}
            type="figure"
            position={getElementPosition(figure.id)}
            customPosition={getCustomPosition(figure.id)}
            onClick={onElementClick}
            onPositionChange={(pos) => onPositionChange(figure.id, pos)}
          >
            <figure className="text-center page-break-inside-avoid">
              <img 
                src={figure.imageUrl} 
                alt={figure.altText}
                className="mx-auto max-w-full h-auto rounded-lg shadow-md"
              />
              <figcaption className="mt-4 text-sm text-gray-600 italic">
                Figure {figure.number}: {figure.caption}
              </figcaption>
            </figure>
          </ThesisPreviewElement>
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
      <ThesisPreviewElement
        key={table.id}
        id={table.id}
        type="table"
        position={getElementPosition(table.id)}
        customPosition={getCustomPosition(table.id)}
        onClick={onElementClick}
        onPositionChange={(pos) => onPositionChange(table.id, pos)}
      >
        <div className="my-8 page-break-inside-avoid">
          <div className="overflow-x-auto">
            <div dangerouslySetInnerHTML={{ __html: table.content }} />
          </div>
          {table.caption && (
            <p className="mt-2 text-sm text-gray-600 text-center">
              Table {table.id}: {table.caption}
            </p>
          )}
        </div>
      </ThesisPreviewElement>
    ));
  };

  const renderCitations = (position: string = 'inline') => {
    if (!citations || citations.length === 0) return null;

    const positionedCitations = citations.filter(citation => 
      getElementPosition(citation.id) === position
    );

    if (positionedCitations.length === 0) return null;

    return (
      <div className="citations-section mt-8 border-t pt-4 page-break-inside-avoid">
        <h3 className="text-lg font-serif mb-2">Citations</h3>
        <div className="space-y-2">
          {positionedCitations.map((citation) => (
            <ThesisPreviewElement
              key={citation.id}
              id={citation.id}
              type="citation"
              position={getElementPosition(citation.id)}
              customPosition={getCustomPosition(citation.id)}
              onClick={onElementClick}
              onPositionChange={(pos) => onPositionChange(citation.id, pos)}
            >
              <div className="citation-reference text-sm">
                {citation.authors.join(', ')} ({citation.year}). {citation.text}.
                {citation.journal && ` ${citation.journal}.`}
                {citation.doi && ` DOI: ${citation.doi}`}
              </div>
            </ThesisPreviewElement>
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