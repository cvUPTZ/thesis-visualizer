import React from 'react';
import { Section } from '@/types/thesis';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FileText } from 'lucide-react';
import { FigureManager } from '@/components/FigureManager';
import { TableManager } from '@/components/TableManager';
import { CitationManager } from '@/components/CitationManager';

interface SectionItemProps {
  section: Section;
  onUpdateSection: (updatedSection: Section) => void;
}

export const SectionItem: React.FC<SectionItemProps> = ({
  section,
  onUpdateSection,
}) => {
  return (
    <div className="border rounded-lg p-4 space-y-4 bg-editor-bg-accent transition-all duration-200 hover:shadow-sm">
      <div className="flex items-center gap-2">
        <FileText className="w-4 h-4 text-editor-text opacity-50" />
        <Input
          value={section.title}
          onChange={(e) => onUpdateSection({ ...section, title: e.target.value })}
          className="text-lg font-medium"
          placeholder="Section Title"
        />
      </div>

      <Textarea
        value={section.content}
        onChange={(e) => onUpdateSection({ ...section, content: e.target.value })}
        className="min-h-[200px] bg-white"
        placeholder="Section Content"
      />

      <div className="space-y-6 pt-4">
        <FigureManager
          figures={section.figures}
          onAddFigure={(figure) => {
            onUpdateSection({
              ...section,
              figures: [...section.figures, figure],
            });
          }}
          onRemoveFigure={(figureId) => {
            onUpdateSection({
              ...section,
              figures: section.figures.filter((f) => f.id !== figureId),
            });
          }}
          onUpdateFigure={(figure) => {
            onUpdateSection({
              ...section,
              figures: section.figures.map((f) =>
                f.id === figure.id ? figure : f
              ),
            });
          }}
        />
        <TableManager
          tables={section.tables}
          onAddTable={(table) => {
            onUpdateSection({
              ...section,
              tables: [...section.tables, table],
            });
          }}
          onRemoveTable={(tableId) => {
            onUpdateSection({
              ...section,
              tables: section.tables.filter((t) => t.id !== tableId),
            });
          }}
          onUpdateTable={(table) => {
            onUpdateSection({
              ...section,
              tables: section.tables.map((t) =>
                t.id === table.id ? table : t
              ),
            });
          }}
        />
        <CitationManager
          citations={section.citations}
          onAddCitation={(citation) => {
            onUpdateSection({
              ...section,
              citations: [...section.citations, citation],
            });
          }}
          onRemoveCitation={(citationId) => {
            onUpdateSection({
              ...section,
              citations: section.citations.filter((c) => c.id !== citationId),
            });
          }}
          onUpdateCitation={(citation) => {
            onUpdateSection({
              ...section,
              citations: section.citations.map((c) =>
                c.id === citation.id ? citation : c
              ),
            });
          }}
        />
      </div>
    </div>
  );
};