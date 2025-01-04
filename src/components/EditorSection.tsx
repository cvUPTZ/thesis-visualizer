import React from 'react';
import { Section } from '@/types/thesis';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FigureManager } from './FigureManager';
import { TableManager } from './TableManager';
import { CitationManager } from './CitationManager';
import { ReferenceManager } from './ReferenceManager';
import { MarkdownEditor } from './MarkdownEditor';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
  console.log('EditorSection rendering with section:', section);

  if (!isActive) return null;

  const handleSectionUpdate = (updatedSection: Section) => {
    console.log('Updating section:', updatedSection);
    // Trigger content update to ensure changes are reflected immediately
    onContentChange(updatedSection.id, updatedSection.content);
  };

  const handleAddFigure = (figure: any) => {
    console.log('Adding figure:', figure);
    const figures = Array.isArray(section.figures) ? section.figures : [];
    const updatedSection = {
      ...section,
      figures: [...figures, figure],
      content: section.content // Preserve existing content
    };
    handleSectionUpdate(updatedSection);
    toast({
      title: "Success",
      description: "Figure added successfully",
    });
  };

  const handleAddTable = (table: any) => {
    console.log('Adding table:', table);
    const tables = Array.isArray(section.tables) ? section.tables : [];
    const updatedSection = {
      ...section,
      tables: [...tables, table],
      content: section.content // Preserve existing content
    };
    handleSectionUpdate(updatedSection);
    toast({
      title: "Success",
      description: "Table added successfully",
    });
  };

  const handleAddCitation = (citation: any) => {
    console.log('Adding citation:', citation);
    const citations = Array.isArray(section.citations) ? section.citations : [];
    const updatedSection = {
      ...section,
      citations: [...citations, citation],
      content: section.content // Preserve existing content
    };
    handleSectionUpdate(updatedSection);
    toast({
      title: "Success",
      description: "Citation added successfully",
    });
  };

  const handleAddReference = (reference: any) => {
    console.log('Adding reference:', reference);
    const references = Array.isArray(section.references) ? section.references : [];
    const updatedSection = {
      ...section,
      references: [...references, reference],
      content: section.content // Preserve existing content
    };
    handleSectionUpdate(updatedSection);
    toast({
      title: "Success",
      description: "Reference added successfully",
    });
  };

  return (
    <div className="editor-section animate-fade-in bg-editor-bg border border-editor-border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Input
            value={section.title}
            onChange={(e) => onTitleChange(section.id, e.target.value)}
            className="text-xl font-serif border-none bg-transparent px-0 focus-visible:ring-0 text-editor-text placeholder:text-editor-placeholder"
            placeholder="Section Title"
          />
          {section.required && (
            <Badge variant="secondary" className="bg-editor-accent/10 text-editor-accent">
              Required
            </Badge>
          )}
        </div>
        
        <div className="relative">
          <MarkdownEditor
            value={section.content}
            onChange={(value) => onContentChange(section.id, value || '')}
            placeholder="Start writing..."
          />
        </div>

        <div className="space-y-8 pt-4 border-t border-editor-border">
          <FigureManager
            figures={section.figures || []}
            onAddFigure={handleAddFigure}
            onRemoveFigure={(id) => {
              const updatedSection = {
                ...section,
                figures: (section.figures || []).filter(f => f.id !== id)
              };
              handleSectionUpdate(updatedSection);
            }}
            onUpdateFigure={(figure) => {
              const updatedSection = {
                ...section,
                figures: (section.figures || []).map(f => f.id === figure.id ? figure : f)
              };
              handleSectionUpdate(updatedSection);
            }}
          />
          <TableManager
            tables={section.tables || []}
            onAddTable={handleAddTable}
            onRemoveTable={(id) => {
              const updatedSection = {
                ...section,
                tables: (section.tables || []).filter(t => t.id !== id)
              };
              handleSectionUpdate(updatedSection);
            }}
            onUpdateTable={(table) => {
              const updatedSection = {
                ...section,
                tables: (section.tables || []).map(t => t.id === table.id ? table : t)
              };
              handleSectionUpdate(updatedSection);
            }}
          />
          <CitationManager
            citations={section.citations || []}
            onAddCitation={handleAddCitation}
            onRemoveCitation={(id) => {
              const updatedSection = {
                ...section,
                citations: (section.citations || []).filter(c => c.id !== id)
              };
              handleSectionUpdate(updatedSection);
            }}
            onUpdateCitation={(citation) => {
              const updatedSection = {
                ...section,
                citations: (section.citations || []).map(c => c.id === citation.id ? citation : c)
              };
              handleSectionUpdate(updatedSection);
            }}
          />
          {section.type === 'references' && (
            <ReferenceManager
              references={section.references || []}
              onAddReference={handleAddReference}
              onRemoveReference={(id) => {
                const updatedSection = {
                  ...section,
                  references: (section.references || []).filter(r => r.id !== id)
                };
                handleSectionUpdate(updatedSection);
              }}
              onUpdateReference={(reference) => {
                const updatedSection = {
                  ...section,
                  references: (section.references || []).map(r => r.id === reference.id ? reference : r)
                };
                handleSectionUpdate(updatedSection);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};