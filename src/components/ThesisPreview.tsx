import React, { useState } from 'react';
import { Thesis, Section, ThesisSectionType, Figure, Table, Citation } from '@/types/thesis';
import MDEditor from '@uiw/react-md-editor';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { ElementPositionManager } from './thesis/preview/ElementPositionManager';

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

  const getElementPosition = (elementId: string): ElementPosition['position'] => {
    const position = elementPositions.find(p => p.id === elementId);
    return position?.position || 'inline';
  };

  const renderFigures = (figures: Section['figures'], position: ElementPosition['position'] = 'inline') => {
    if (!figures || figures.length === 0) return null;
    
    const positionedFigures = figures.filter(figure => 
      getElementPosition(figure.id) === position
    );

    if (positionedFigures.length === 0) return null;

    return positionedFigures.map((figure) => (
      <figure 
        key={figure.id} 
        className={cn(
          "my-8 text-center page-break-inside-avoid",
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
          className="mx-auto max-w-full h-auto"
        />
        <figcaption className="mt-2 text-sm text-gray-600">
          Figure {figure.number}: {figure.caption}
        </figcaption>
      </figure>
    ));
  };

  const renderTables = (tables: Section['tables'], position: ElementPosition['position'] = 'inline') => {
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

  const renderCitations = (citations: Section['citations'], position: ElementPosition['position'] = 'inline') => {
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

  const renderTitlePage = () => {
    console.log('Rendering Title Page with data:', thesis.metadata);
    return (
      <div className="thesis-page title-page">
        <div className="thesis-title-content">
          <div className="university-name">{thesis.metadata?.universityName || "Your University Name"}</div>
          <div className="department-name">{thesis.metadata?.departmentName || "Department of Your Field"}</div>
          <div className="thesis-main-title">
            {titleSection?.content || "Untitled Thesis"}
          </div>
          <div className="thesis-subtitle">
            A thesis submitted in partial fulfillment<br />
            of the requirements for the degree of<br />
            Doctor of Philosophy
          </div>
          <div className="thesis-author">
            by<br />
            {thesis.metadata?.authorName || "Author Name"}
          </div>
          <div className="thesis-date">
               {thesis.metadata?.thesisDate || "Month Year"}
          </div>
          <div className="thesis-committee">
            Thesis Committee:<br />
            {thesis.metadata?.committeeMembers?.map((member, index) => (
              <React.Fragment key={index}>
                {member}
                <br />
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderAbstract = () => {
    if (!abstractSection) return null;
    return (
      <div className="thesis-page">
        <div className="thesis-header">
          Abstract
        </div>
        <div className="thesis-content thesis-abstract">
          <h2 className="text-2xl font-serif mb-4">Abstract</h2>
          <MDEditor.Markdown 
              source={abstractSection?.content || "No Abstract Provided"}
              className="prose prose-sm max-w-none"
          />
        </div>
        <div className="thesis-footer">
          <span>Page <span className="page-number"></span></span>
        </div>
      </div>
    );
  };

  const renderSection = (section: Section, chapterTitle?: string) => {
    if (!section) return null;

    if (section.type === 'title') {
      return renderTitlePage();
    }
    if (section.type === 'abstract') {
      return renderAbstract();
    }

    const isSpecialSection = section.type === 'references' || section.type === 'table-of-contents';
    
    return (
      <div key={section.id} className={cn(
        "thesis-page relative",
        isSpecialSection && "special-section",
        section.type === 'table-of-contents' && "toc-section"
      )}>
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
              {chapterTitle && <h2 className="text-2xl font-serif mb-4 page-break-after-avoid">{section.title}</h2>}
              <div className="page-break-inside-avoid">
                <MDEditor.Markdown source={section.content} />
              </div>
              
              {renderFigures(section.figures, 'top')}
              {renderTables(section.tables, 'top')}
              {renderCitations(section.citations, 'top')}
              
              {renderFigures(section.figures, 'inline')}
              {renderTables(section.tables, 'inline')}
              {renderCitations(section.citations, 'inline')}
              
              {renderFigures(section.figures, 'bottom')}
              {renderTables(section.tables, 'bottom')}
              {renderCitations(section.citations, 'bottom')}
              
              {renderFigures(section.figures, 'custom')}
              {renderTables(section.tables, 'custom')}
              {renderCitations(section.citations, 'custom')}
            </>
          )}
          {section.type === 'table-of-contents' && (
            <div className="toc-content page-break-inside-avoid">
              <h2 className="text-2xl font-serif mb-4">Table of Contents</h2>
              {/* TOC content will be generated automatically */}
            </div>
          )}
        </div>
        <div className="thesis-footer">
          {!isSpecialSection && <span>Page <span className="page-number"></span></span>}
        </div>
      </div>
    );
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        <ElementPositionManager
          figures={thesis.chapters.flatMap(chapter => 
            chapter.sections.flatMap(section => section.figures)
          )}
          tables={thesis.chapters.flatMap(chapter => 
            chapter.sections.flatMap(section => section.tables)
          )}
          citations={thesis.chapters.flatMap(chapter => 
            chapter.sections.flatMap(section => section.citations)
          )}
          onUpdatePosition={handleUpdatePosition}
        />
        
        <div className="thesis-preview-container">
          <div className="thesis-preview">
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
      </div>
    </ScrollArea>
  );
};
