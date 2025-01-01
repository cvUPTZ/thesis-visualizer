import React from 'react';
import { Chapter, Section } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FigureManager } from './FigureManager';
import { TableManager } from './TableManager';
import { CitationManager } from './CitationManager';
import { PlusCircle } from 'lucide-react';
import { useId } from 'react'; // Use react hook to generate IDs

interface ChapterManagerProps {
    chapters: Chapter[];
    onUpdateChapter: (chapter: Chapter) => void;
    onAddChapter: () => void;
}


export const ChapterManager = ({
    chapters,
    onUpdateChapter,
    onAddChapter
}: ChapterManagerProps) => {
  const generateId = useId(); // Generate unique ID prefix
    
  const handleAddSection = (chapterId: string) => {
    const chapter = chapters.find((c) => c.id === chapterId);
      if (!chapter) return;

    const newSection: Section = {
        id: `${generateId}-section-${Date.now()}`,
        title: 'New Section',
        content: '',
        type: 'custom',
        order: chapter.sections.length + 1,
        figures: [],
        tables: [],
        citations: []
      };

    const introductionSection: Section = {
      id: `${generateId}-intro-section-${Date.now()}`,
      title: 'Introduction',
      content: 'Introduction',
       type: 'custom',
       order: 1,
       figures: [],
       tables: [],
       citations: []
    };


    onUpdateChapter({
      ...chapter,
      sections: [introductionSection, ...chapter.sections, newSection]
    });
  };

  return (
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
            {chapter.sections.map((section, index) => {
                 if(index === 0 && section.title === 'Introduction') {
                    return (
                      <div key={section.id} className="border-t pt-6 space-y-4">
                        <Input
                            value={section.title}
                            className="text-lg font-medium"
                            placeholder="Section Title"
                             disabled
                        />
                         <Textarea
                            value={section.content}
                            className="min-h-[200px]"
                            placeholder="Section Content"
                            disabled
                        />
                      </div>
                    )
                 }
                  return (
                  <div key={section.id} className="border-t pt-6 space-y-4">
                    <Input
                      value={section.title}
                      onChange={(e) => {
                        const updatedSections = chapter.sections.map((s) =>
                          s.id === section.id
                            ? { ...s, title: e.target.value }
                            : s
                        );
                        onUpdateChapter({ ...chapter, sections: updatedSections });
                      }}
                      className="text-lg font-medium"
                      placeholder="Section Title"
                    />
                    <Textarea
                      value={section.content}
                      onChange={(e) => {
                        const updatedSections = chapter.sections.map((s) =>
                          s.id === section.id
                            ? { ...s, content: e.target.value }
                            : s
                        );
                        onUpdateChapter({ ...chapter, sections: updatedSections });
                      }}
                      className="min-h-[200px]"
                      placeholder="Section Content"
                    />
                    <FigureManager
                        figures={section.figures}
                        onAddFigure={(figure) => {
                          const updatedSections = chapter.sections.map((s) =>
                            s.id === section.id
                                ? { ...s, figures: [...s.figures, figure] }
                                : s
                          );
                          onUpdateChapter({ ...chapter, sections: updatedSections });
                        }}
                        onRemoveFigure={(figureId) => {
                          const updatedSections = chapter.sections.map((s) =>
                            s.id === section.id
                              ? {
                                ...s,
                                figures: s.figures.filter((f) => f.id !== figureId)
                              }
                              : s
                          );
                          onUpdateChapter({ ...chapter, sections: updatedSections });
                        }}
                         onUpdateFigure={(figure) => {
                          const updatedSections = chapter.sections.map((s) =>
                            s.id === section.id
                              ? {
                                ...s,
                                figures: s.figures.map((f) =>
                                  f.id === figure.id ? figure : f
                                )
                              }
                              : s
                          );
                          onUpdateChapter({ ...chapter, sections: updatedSections });
                        }}
                    />
                    <TableManager
                      tables={section.tables}
                        onAddTable={(table) => {
                            const updatedSections = chapter.sections.map((s) =>
                                s.id === section.id
                                    ? { ...s, tables: [...s.tables, table] }
                                    : s
                            );
                          onUpdateChapter({ ...chapter, sections: updatedSections });
                        }}
                        onRemoveTable={(tableId) => {
                            const updatedSections = chapter.sections.map((s) =>
                              s.id === section.id
                                ? {
                                    ...s,
                                    tables: s.tables.filter((t) => t.id !== tableId)
                                  }
                                : s
                            );
                          onUpdateChapter({ ...chapter, sections: updatedSections });
                        }}
                        onUpdateTable={(table) => {
                            const updatedSections = chapter.sections.map((s) =>
                              s.id === section.id
                                ? {
                                    ...s,
                                    tables: s.tables.map((t) =>
                                      t.id === table.id ? table : t
                                    )
                                  }
                                : s
                            );
                            onUpdateChapter({ ...chapter, sections: updatedSections });
                        }}
                    />
                    <CitationManager
                         citations={section.citations}
                        onAddCitation={(citation) => {
                            const updatedSections = chapter.sections.map((s) =>
                              s.id === section.id
                                ? { ...s, citations: [...s.citations, citation] }
                                : s
                            );
                            onUpdateChapter({ ...chapter, sections: updatedSections });
                          }}
                          onRemoveCitation={(citationId) => {
                            const updatedSections = chapter.sections.map((s) =>
                              s.id === section.id
                                ? {
                                    ...s,
                                    citations: s.citations.filter(
                                      (c) => c.id !== citationId
                                    )
                                  }
                                : s
                            );
                            onUpdateChapter({ ...chapter, sections: updatedSections });
                          }}
                          onUpdateCitation={(citation) => {
                            const updatedSections = chapter.sections.map((s) =>
                              s.id === section.id
                                ? {
                                    ...s,
                                    citations: s.citations.map((c) =>
                                      c.id === citation.id ? citation : c
                                    )
                                  }
                                : s
                            );
                            onUpdateChapter({ ...chapter, sections: updatedSections });
                          }}
                    />
                  </div>
                 )
              })}
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
  );
};