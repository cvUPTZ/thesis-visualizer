import React from 'react';
import { Chapter, Section } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FigureManager } from './FigureManager';
import { TableManager } from './TableManager';
import { CitationManager } from './CitationManager';
import { 
  PlusCircle, 
  BookOpen, 
  ChevronDown, 
  ChevronUp,
  FileText,
  MoveVertical
} from 'lucide-react';
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
  const [openChapters, setOpenChapters] = React.useState<string[]>([]);

  const toggleChapter = (chapterId: string) => {
    setOpenChapters(prev => 
      prev.includes(chapterId) 
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

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
      citations: []
    };

    onUpdateChapter({
      ...chapter,
      sections: [...chapter.sections, newSection]
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center bg-editor-bg p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-serif font-semibold">Chapters</h2>
        </div>
        <Button 
          onClick={onAddChapter} 
          className="flex items-center gap-2 bg-editor-accent hover:bg-editor-accent-hover transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Add Chapter
        </Button>
      </div>

      <div className="space-y-4">
        {chapters.map((chapter) => (
          <Collapsible
            key={chapter.id}
            open={openChapters.includes(chapter.id)}
            onOpenChange={() => toggleChapter(chapter.id)}
            className="border rounded-lg bg-white shadow-sm transition-all duration-200 hover:shadow-md"
          >
            <CollapsibleTrigger className="w-full p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MoveVertical className="w-4 h-4 text-editor-text opacity-50" />
                <Input
                  value={chapter.title}
                  onChange={(e) => onUpdateChapter({ ...chapter, title: e.target.value })}
                  className="text-xl font-serif border-none bg-transparent px-0 focus-visible:ring-0 w-full"
                  placeholder="Chapter Title"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              {openChapters.includes(chapter.id) ? (
                <ChevronUp className="w-5 h-5 text-editor-text" />
              ) : (
                <ChevronDown className="w-5 h-5 text-editor-text" />
              )}
            </CollapsibleTrigger>

            <CollapsibleContent className="p-4 pt-0 space-y-4">
              {chapter.sections.map((section, index) => (
                <div 
                  key={section.id} 
                  className="border rounded-lg p-4 space-y-4 bg-editor-bg-accent transition-all duration-200 hover:shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-editor-text opacity-50" />
                    <Input
                      value={section.title}
                      onChange={(e) => {
                        const updatedSections = chapter.sections.map((s) =>
                          s.id === section.id ? { ...s, title: e.target.value } : s
                        );
                        onUpdateChapter({ ...chapter, sections: updatedSections });
                      }}
                      className="text-lg font-medium"
                      placeholder="Section Title"
                    />
                  </div>

                  <Textarea
                    value={section.content}
                    onChange={(e) => {
                      const updatedSections = chapter.sections.map((s) =>
                        s.id === section.id ? { ...s, content: e.target.value } : s
                      );
                      onUpdateChapter({ ...chapter, sections: updatedSections });
                    }}
                    className="min-h-[200px] bg-white"
                    placeholder="Section Content"
                  />

                  <div className="space-y-6 pt-4">
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
                </div>
              ))}
              <Button
                onClick={() => handleAddSection(chapter.id)}
                variant="outline"
                className="w-full mt-4 flex items-center justify-center gap-2 hover:bg-editor-hover"
              >
                <PlusCircle className="w-4 h-4" />
                Add Section
              </Button>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};