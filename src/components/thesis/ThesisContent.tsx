// File: src/components/thesis/ThesisContent.tsx
import React from 'react';
import { Chapter, Section, ThesisSectionType } from '@/types/thesis';
import { MarkdownEditor } from '../MarkdownEditor';
import { FigureManager } from '../FigureManager';
import { TableManager } from '../TableManager';
import { CitationManager } from '../CitationManager';
import { ReferenceManager } from '../ReferenceManager';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { PlusCircle } from 'lucide-react';

interface ThesisContentProps {
  frontMatter: Section[];
  chapters: Chapter[];
  backMatter: Section[];
  activeSection: string;
  onContentChange: (id: string, content: string) => void;
  onTitleChange: (id: string, title: string) => void;
  onUpdateChapter: (chapter: Chapter) => void;
  onAddChapter: () => void;
}


export const ThesisContent = ({
    frontMatter,
    chapters,
    backMatter,
    activeSection,
    onContentChange,
    onTitleChange,
    onUpdateChapter,
    onAddChapter
}: ThesisContentProps) => {

    const handleAddSection = (chapterId: string) => {
        const chapter = chapters.find((c) => c.id === chapterId);
        if (!chapter) return;

        const newSection: Section = {
            id: Date.now().toString(),
            title: 'New Section',
            content: '',
            type: 'custom',
            order: chapter.sections.length + 1,
            figures: [],
            tables: [],
            citations: [],
            references: []
        };

        onUpdateChapter({
            ...chapter,
            sections: [...chapter.sections, newSection]
        });
    };
  const renderSectionContent = (section: Section) => {
    const isActive = activeSection === section.id;

    if (!isActive) return null;
      return (
          <div key={section.id} className="editor-section space-y-6">
            <div className="flex items-center gap-3 mb-4">
              <Input
                value={section.title}
                onChange={(e) => onTitleChange(section.id, e.target.value)}
                className="text-xl font-serif border-none bg-transparent px-0 focus-visible:ring-0"
              />
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
      )
  };


  return (
    <div className="space-y-6">
          {frontMatter.map(section => renderSectionContent(section))}
          <div className="space-y-6">
          <div className="flex justify-between items-center">
              <h2 className="text-2xl font-serif font-semibold">Chapters</h2>
              <Button onClick={onAddChapter} className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4" />
                  Add Chapter
              </Button>
          </div>
            {chapters.map((chapter) => (
              <div key={chapter.id} className="border rounded-lg p-6 space-y-6">
                <Input
                  value={chapter.title}
                  onChange={(e) =>
                    onUpdateChapter({ ...chapter, title: e.target.value })
                  }
                  className="text-xl font-serif"
                  placeholder="Chapter Title"
                />
                <div className="space-y-6">
                  {chapter.sections.map((section) => renderSectionContent(section))}
                  <Button
                    onClick={() => handleAddSection(chapter.id)}
                    variant="outline"
                    className="mt-4"
                  >
                    Add Section
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {backMatter.map(section => renderSectionContent(section))}
    </div>
  );
};