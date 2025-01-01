import React from 'react';
import { Section } from '@/types/thesis';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FigureManager } from './FigureManager';
import { TableManager } from './TableManager';
import { CitationManager } from './CitationManager';
import { ReferenceManager } from './ReferenceManager';
import { MarkdownEditor } from './MarkdownEditor';

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

      const handleFigureChange = (newFigures: typeof section.figures) => {
        onContentChange(section.id, JSON.stringify({...section, figures: newFigures}));
      }

       const handleTableChange = (newTables: typeof section.tables) => {
        onContentChange(section.id, JSON.stringify({...section, tables: newTables}));
      }
      
      const handleCitationChange = (newCitations: typeof section.citations) => {
          onContentChange(section.id, JSON.stringify({...section, citations: newCitations}));
      };

      const handleReferenceChange = (newReferences: typeof section.references) => {
        onContentChange(section.id, JSON.stringify({...section, references: newReferences}))
      }


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
      <div className="mb-6">
        <MarkdownEditor
          value={section.content}
          onChange={(value) => onContentChange(section.id, value || '')}
          placeholder="Start writing..."
        />
      </div>
      <div className="space-y-8">
        <FigureManager
          figures={section.figures}
           onAddFigure={(figure) => {
             handleFigureChange([...section.figures, figure])
            }}
            onRemoveFigure={(id) => {
               handleFigureChange(section.figures.filter(f => f.id !== id))
             }}
            onUpdateFigure={(figure) => {
              handleFigureChange(section.figures.map(f => f.id === figure.id ? figure : f))
           }}
        />
         <TableManager
          tables={section.tables}
           onAddTable={(table) => {
             handleTableChange([...section.tables, table])
          }}
            onRemoveTable={(id) => {
               handleTableChange(section.tables.filter(t => t.id !== id))
            }}
            onUpdateTable={(table) => {
              handleTableChange(section.tables.map(t => t.id === table.id ? table : t))
            }}
        />
        <CitationManager
          citations={section.citations}
           onAddCitation={(citation) => {
             handleCitationChange([...section.citations, citation])
           }}
           onRemoveCitation={(id) => {
              handleCitationChange(section.citations.filter(c => c.id !== id))
           }}
            onUpdateCitation={(citation) => {
                handleCitationChange(section.citations.map(c => c.id === citation.id ? citation : c))
            }}
         />
         {section.type === 'references' && section.references && (
           <ReferenceManager
            references={section.references}
             onAddReference={(reference) => {
               handleReferenceChange([...(section.references || []), reference]);
            }}
             onRemoveReference={(id) => {
                handleReferenceChange(section.references?.filter(r => r.id !== id))
           }}
             onUpdateReference={(reference) => {
               handleReferenceChange(section.references?.map(r => r.id === reference.id ? reference : r))
           }}
         />
       )}
      </div>
    </div>
  );
};