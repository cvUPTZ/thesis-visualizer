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
    // Create a new section object with all updates
    const newSection = {
      ...section,
      ...updatedSection,
      content: updatedSection.content || section.content
    };
    console.log('New section state:', newSection);
    onContentChange(newSection.id, newSection.content);
  };

  const handleAddFigure = (figure: any) => {
    console.log('Adding figure:', figure);
    const figures = Array.isArray(section.figures) ? section.figures : [];
    handleSectionUpdate({
      ...section,
      figures: [...figures, figure]
    });
    toast({
      title: "Success",
      description: "Figure added successfully",
    });
  };

  const handleAddTable = (table: any) => {
    console.log('Adding table:', table);
    const tables = Array.isArray(section.tables) ? section.tables : [];
    handleSectionUpdate({
      ...section,
      tables: [...tables, table]
    });
    toast({
      title: "Success",
      description: "Table added successfully",
    });
  };

  const handleAddCitation = (citation: any) => {
    console.log('Adding citation:', citation);
    const citations = Array.isArray(section.citations) ? section.citations : [];
    handleSectionUpdate({
      ...section,
      citations: [...citations, citation]
    });
    toast({
      title: "Success",
      description: "Citation added successfully",
    });
  };

  const handleAddReference = (reference: any) => {
    console.log('Adding reference:', reference);
    const references = Array.isArray(section.references) ? section.references : [];
    handleSectionUpdate({
      ...section,
      references: [...references, reference]
    });
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
              handleSectionUpdate({
                ...section,
                figures: (section.figures || []).filter(f => f.id !== id)
              });
            }}
            onUpdateFigure={(figure) => {
              handleSectionUpdate({
                ...section,
                figures: (section.figures || []).map(f => f.id === figure.id ? figure : f)
              });
            }}
          />
          <TableManager
            tables={section.tables || []}
            onAddTable={handleAddTable}
            onRemoveTable={(id) => {
              handleSectionUpdate({
                ...section,
                tables: (section.tables || []).filter(t => t.id !== id)
              });
            }}
            onUpdateTable={(table) => {
              handleSectionUpdate({
                ...section,
                tables: (section.tables || []).map(t => t.id === table.id ? table : t)
              });
            }}
          />
          <CitationManager
            citations={section.citations || []}
            onAddCitation={handleAddCitation}
            onRemoveCitation={(id) => {
              handleSectionUpdate({
                ...section,
                citations: (section.citations || []).filter(c => c.id !== id)
              });
            }}
            onUpdateCitation={(citation) => {
              handleSectionUpdate({
                ...section,
                citations: (section.citations || []).map(c => c.id === citation.id ? citation : c)
              });
            }}
          />
          {section.type === 'references' && (
            <ReferenceManager
              references={section.references || []}
              onAddReference={handleAddReference}
              onRemoveReference={(id) => {
                handleSectionUpdate({
                  ...section,
                  references: (section.references || []).filter(r => r.id !== id)
                });
              }}
              onUpdateReference={(reference) => {
                handleSectionUpdate({
                  ...section,
                  references: (section.references || []).map(r => r.id === reference.id ? reference : r)
                });
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};