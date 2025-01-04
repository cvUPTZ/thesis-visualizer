import React from 'react';
import { Section } from '@/types/thesis';
import { FigureManager } from '../FigureManager';
import { TableManager } from '../TableManager';
import { CitationManager } from '../CitationManager';
import { ReferenceManager } from '../ReferenceManager';

interface SectionManagersProps {
  section: Section;
  onSectionUpdate: (updatedSection: Section) => void;
}

export const SectionManagers = ({ section, onSectionUpdate }: SectionManagersProps) => {
  console.log('Rendering SectionManagers:', { 
    sectionId: section.id,
    figuresCount: section.figures?.length,
    tablesCount: section.tables?.length,
    citationsCount: section.citations?.length
  });

  const handleFigureUpdate = (figures: Section['figures']) => {
    console.log('Updating figures:', figures);
    onSectionUpdate({
      ...section,
      figures
    });
  };

  const handleTableUpdate = (tables: Section['tables']) => {
    console.log('Updating tables:', tables);
    onSectionUpdate({
      ...section,
      tables
    });
  };

  const handleCitationUpdate = (citations: Section['citations']) => {
    console.log('Updating citations:', citations);
    onSectionUpdate({
      ...section,
      citations
    });
  };

  const handleReferenceUpdate = (references: Section['references']) => {
    console.log('Updating references:', references);
    onSectionUpdate({
      ...section,
      references
    });
  };

  return (
    <div className="space-y-8 pt-4 border-t border-editor-border">
      <FigureManager
        figures={section.figures}
        onAddFigure={(figure) => handleFigureUpdate([...section.figures, figure])}
        onRemoveFigure={(id) => handleFigureUpdate(section.figures.filter(f => f.id !== id))}
        onUpdateFigure={(figure) => handleFigureUpdate(section.figures.map(f => f.id === figure.id ? figure : f))}
      />
      <TableManager
        tables={section.tables}
        onAddTable={(table) => handleTableUpdate([...section.tables, table])}
        onRemoveTable={(id) => handleTableUpdate(section.tables.filter(t => t.id !== id))}
        onUpdateTable={(table) => handleTableUpdate(section.tables.map(t => t.id === table.id ? table : t))}
      />
      <CitationManager
        citations={section.citations}
        onAddCitation={(citation) => handleCitationUpdate([...section.citations, citation])}
        onRemoveCitation={(id) => handleCitationUpdate(section.citations.filter(c => c.id !== id))}
        onUpdateCitation={(citation) => handleCitationUpdate(section.citations.map(c => c.id === citation.id ? citation : c))}
      />
      {section.type === 'references' && (
        <ReferenceManager
          references={section.references || []}
          onAddReference={(reference) => handleReferenceUpdate([...(section.references || []), reference])}
          onRemoveReference={(id) => handleReferenceUpdate((section.references || []).filter(r => r.id !== id))}
          onUpdateReference={(reference) => handleReferenceUpdate((section.references || []).map(r => r.id === reference.id ? reference : r))}
        />
      )}
    </div>
  );
};