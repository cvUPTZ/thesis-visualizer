import React from 'react';
import { Section } from '@/types/thesis';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FigureManager } from './FigureManager';
import { TableManager } from './TableManager';
import { CitationManager } from './CitationManager';
import { ReferenceManager } from './ReferenceManager';

interface EditorSectionProps {
  section: Section;
  isActive: boolean;
  onContentChange: (id: string, content: string) => void;
  onTitleChange: (id: string, title: string) => void;
}

export const EditorSection = ({
  section,
  isActive,
  onContentChange,
  onTitleChange
}: EditorSectionProps) => {
  if (!isActive) return null;

  return (
    <div className="editor-section">
      <div className="flex items-center gap-3 mb-4">
        <Input
          value={section.title}
          onChange={(e) => onTitleChange(section.id, e.target.value)}
          className="text-xl font-serif border-none bg-transparent px-0 focus-visible:ring-0"
        />
        {section.required && (
          <Badge variant="secondary">Required</Badge>
        )}
      </div>
      <Textarea
        value={section.content}
        onChange={(e) => onContentChange(section.id, e.target.value)}
        className="min-h-[200px] border-none bg-transparent resize-none focus-visible:ring-0 mb-6"
        placeholder="Start writing..."
      />
      <div className="space-y-8">
        <FigureManager
          figures={section.figures}
          onAddFigure={(figure) => {
            section.figures.push(figure);
            onContentChange(section.id, section.content);
          }}
          onRemoveFigure={(id) => {
            section.figures = section.figures.filter(f => f.id !== id);
            onContentChange(section.id, section.content);
          }}
          onUpdateFigure={(figure) => {
            section.figures = section.figures.map(f => f.id === figure.id ? figure : f);
            onContentChange(section.id, section.content);
          }}
        />
        <TableManager
          tables={section.tables}
          onAddTable={(table) => {
            section.tables.push(table);
            onContentChange(section.id, section.content);
          }}
          onRemoveTable={(id) => {
            section.tables = section.tables.filter(t => t.id !== id);
            onContentChange(section.id, section.content);
          }}
          onUpdateTable={(table) => {
            section.tables = section.tables.map(t => t.id === table.id ? table : t);
            onContentChange(section.id, section.content);
          }}
        />
        <CitationManager
          citations={section.citations}
          onAddCitation={(citation) => {
            section.citations.push(citation);
            onContentChange(section.id, section.content);
          }}
          onRemoveCitation={(id) => {
            section.citations = section.citations.filter(c => c.id !== id);
            onContentChange(section.id, section.content);
          }}
          onUpdateCitation={(citation) => {
            section.citations = section.citations.map(c => c.id === citation.id ? citation : c);
            onContentChange(section.id, section.content);
          }}
        />
        {section.type === 'references' && section.references && (
          <ReferenceManager
            references={section.references}
            onAddReference={(reference) => {
              section.references = [...(section.references || []), reference];
              onContentChange(section.id, section.content);
            }}
            onRemoveReference={(id) => {
              section.references = section.references?.filter(r => r.id !== id);
              onContentChange(section.id, section.content);
            }}
            onUpdateReference={(reference) => {
              section.references = section.references?.map(r => r.id === reference.id ? reference : r);
              onContentChange(section.id, section.content);
            }}
          />
        )}
      </div>
    </div>
  );
};