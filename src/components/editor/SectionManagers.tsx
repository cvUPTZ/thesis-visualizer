import React from 'react';
import { Section } from '@/types/thesis';
import { FigureManager } from '../FigureManager';
import { TableManager } from '../TableManager';
import { CitationManager } from '../CitationManager';
import { ReferenceManager } from '../ReferenceManager';
import { Separator } from '../ui/separator';
import { Image, Table, Quote, BookOpen } from 'lucide-react';

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
    <div className="space-y-8 pt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-6 rounded-lg border-2 transition-all duration-200 hover:shadow-lg
          bg-editor-manager-figure-bg border-editor-manager-figure-border`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-white">
              <Image className="w-5 h-5 text-editor-manager-figure-icon" />
            </div>
            <h3 className="text-lg font-medium">Figures</h3>
          </div>
          <FigureManager
            figures={section.figures}
            onAddFigure={(figure) => handleFigureUpdate([...section.figures, figure])}
            onRemoveFigure={(id) => handleFigureUpdate(section.figures.filter(f => f.id !== id))}
            onUpdateFigure={(figure) => handleFigureUpdate(section.figures.map(f => f.id === figure.id ? figure : f))}
          />
        </div>

        <div className={`p-6 rounded-lg border-2 transition-all duration-200 hover:shadow-lg
          bg-editor-manager-table-bg border-editor-manager-table-border`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-white">
              <Table className="w-5 h-5 text-editor-manager-table-icon" />
            </div>
            <h3 className="text-lg font-medium">Tables</h3>
          </div>
          <TableManager
            tables={section.tables}
            onAddTable={(table) => handleTableUpdate([...section.tables, table])}
            onRemoveTable={(id) => handleTableUpdate(section.tables.filter(t => t.id !== id))}
            onUpdateTable={(table) => handleTableUpdate(section.tables.map(t => t.id === table.id ? table : t))}
          />
        </div>

        <div className={`p-6 rounded-lg border-2 transition-all duration-200 hover:shadow-lg
          bg-editor-manager-citation-bg border-editor-manager-citation-border`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-white">
              <Quote className="w-5 h-5 text-editor-manager-citation-icon" />
            </div>
            <h3 className="text-lg font-medium">Citations</h3>
          </div>
          <CitationManager
            citations={section.citations}
            onAddCitation={(citation) => handleCitationUpdate([...section.citations, citation])}
            onRemoveCitation={(id) => handleCitationUpdate(section.citations.filter(c => c.id !== id))}
            onUpdateCitation={(citation) => handleCitationUpdate(section.citations.map(c => c.id === citation.id ? citation : c))}
          />
        </div>

        {section.type === 'references' && (
          <div className={`p-6 rounded-lg border-2 transition-all duration-200 hover:shadow-lg
            bg-editor-manager-reference-bg border-editor-manager-reference-border`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-white">
                <BookOpen className="w-5 h-5 text-editor-manager-reference-icon" />
              </div>
              <h3 className="text-lg font-medium">References</h3>
            </div>
            <ReferenceManager
              references={section.references || []}
              onAddReference={(reference) => handleReferenceUpdate([...(section.references || []), reference])}
              onRemoveReference={(id) => handleReferenceUpdate((section.references || []).filter(r => r.id !== id))}
              onUpdateReference={(reference) => handleReferenceUpdate((section.references || []).map(r => r.id === reference.id ? reference : r))}
            />
          </div>
        )}
      </div>
    </div>
  );
};