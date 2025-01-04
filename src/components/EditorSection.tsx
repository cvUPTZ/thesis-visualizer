import React from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MarkdownEditor } from './MarkdownEditor';
import { FigureManager } from './FigureManager';
import { TableManager } from './TableManager';
import { CitationManager } from './CitationManager';
import { ReferenceManager } from './ReferenceManager';
import { Section } from '@/types/thesis';

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
  onTitleChange,
}: EditorSectionProps) => {
  if (!isActive) return null;

  return (
    <div className="bg-editor-bg border border-editor-border rounded-lg p-6 mb-6 transition-all duration-200 hover:shadow-editor">
      <div className="flex items-center gap-3 mb-6">
        <Input
          value={section.title}
          onChange={(e) => onTitleChange(section.id, e.target.value)}
          className="text-2xl font-serif border-none bg-transparent px-0 focus-visible:ring-1 focus-visible:ring-editor-accent/30 transition-colors duration-200"
          placeholder="Enter section title..."
        />
        {section.required && (
          <Badge 
            variant="secondary" 
            className="bg-editor-accent/90 text-white hover:bg-editor-accent transition-colors duration-200"
          >
            Required
          </Badge>
        )}
      </div>
      <div className="mb-8">
        <MarkdownEditor
          value={section.content}
          onChange={(value) => onContentChange(section.id, value || '')}
          placeholder="Start writing..."
        />
      </div>
      <div className="space-y-6 divide-y divide-editor-border/30">
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
      </div>
    </div>
  );
};
