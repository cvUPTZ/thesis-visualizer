import React, { useState } from 'react';
import { Chapter, Footnote } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChapterContent } from './ChapterContent';
import { ChapterFigures } from './ChapterFigures';
import { ChapterTables } from './ChapterTables';
import { ChapterCitations } from './ChapterCitations';
import { ChapterReferences } from './ChapterReferences';
import { FootnoteManager } from './FootnoteManager';

interface ChapterItemProps {
  chapter: Chapter;
  chapterNumber: number;
  isOpen: boolean;
  onToggle: () => void;
  onUpdateChapter: (chapter: Chapter) => void;
  isSelected?: boolean;
  onSelect?: () => void;
}

export const ChapterItem: React.FC<ChapterItemProps> = ({
  chapter,
  chapterNumber,
  isOpen,
  onToggle,
  onUpdateChapter,
  isSelected,
  onSelect
}) => {
  const [activeTab, setActiveTab] = useState('content');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateChapter({
      ...chapter,
      title: e.target.value
    });
  };

  const handleFootnoteAdd = (sectionId: string, footnote: Footnote) => {
    const updatedSections = chapter.sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          footnotes: [...(section.footnotes || []), footnote]
        };
      }
      return section;
    });

    onUpdateChapter({
      ...chapter,
      sections: updatedSections
    });
  };

  const handleFootnoteRemove = (sectionId: string, footnoteId: string) => {
    const updatedSections = chapter.sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          footnotes: (section.footnotes || []).filter(f => f.id !== footnoteId)
        };
      }
      return section;
    });

    onUpdateChapter({
      ...chapter,
      sections: updatedSections
    });
  };

  const handleFootnoteUpdate = (sectionId: string, updatedFootnote: Footnote) => {
    const updatedSections = chapter.sections.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          footnotes: (section.footnotes || []).map(f => 
            f.id === updatedFootnote.id ? updatedFootnote : f
          )
        };
      }
      return section;
    });

    onUpdateChapter({
      ...chapter,
      sections: updatedSections
    });
  };

  return (
    <div className={cn(
      "border rounded-xl bg-white shadow-sm transition-all duration-200",
      "hover:shadow-md",
      isOpen && "ring-2 ring-primary/10",
      isSelected && "ring-2 ring-primary"
    )}>
      <div className="p-4 flex items-center justify-between group">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect?.()}
            className="ml-2"
          />
          <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors cursor-move">
            <GripVertical className="w-4 h-4 text-gray-500" />
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary font-medium px-3 py-1 rounded-md">
              Ch. {chapterNumber}
            </div>
            <Input
              value={chapter.title}
              onChange={handleTitleChange}
              className="text-xl font-serif border-none bg-transparent px-0 focus-visible:ring-0 w-full min-w-[300px]"
              placeholder="Chapter Title"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {chapter.sections.length} {chapter.sections.length === 1 ? 'section' : 'sections'}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="p-2"
          >
            {isOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </Button>
        </div>
      </div>

      {isOpen && (
        <div className="p-4 pt-0 space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="figures">Figures</TabsTrigger>
              <TabsTrigger value="tables">Tables</TabsTrigger>
              <TabsTrigger value="citations">Citations</TabsTrigger>
              <TabsTrigger value="references">References</TabsTrigger>
              <TabsTrigger value="footnotes">Footnotes</TabsTrigger>
            </TabsList>

            <TabsContent value="content">
              <ChapterContent 
                chapter={chapter}
                onUpdateChapter={onUpdateChapter}
              />
            </TabsContent>

            <TabsContent value="figures">
              <ChapterFigures
                chapter={chapter}
                onUpdateChapter={onUpdateChapter}
              />
            </TabsContent>

            <TabsContent value="tables">
              <ChapterTables
                chapter={chapter}
                onUpdateChapter={onUpdateChapter}
              />
            </TabsContent>

            <TabsContent value="citations">
              <ChapterCitations
                chapter={chapter}
                onUpdateChapter={onUpdateChapter}
              />
            </TabsContent>

            <TabsContent value="references">
              <ChapterReferences
                chapter={chapter}
                onUpdateChapter={onUpdateChapter}
              />
            </TabsContent>

            <TabsContent value="footnotes">
              {chapter.sections.map((section) => (
                <div key={section.id} className="mb-8">
                  <h3 className="text-lg font-medium mb-4">
                    Section: {section.title}
                  </h3>

                  <FootnoteManager
                    footnotes={section.footnotes || []}
                    onAddFootnote={(footnote) => handleFootnoteAdd(section.id, footnote)}
                    onRemoveFootnote={(id) => handleFootnoteRemove(section.id, id)}
                    onUpdateFootnote={(footnote) => handleFootnoteUpdate(section.id, footnote)}
                    thesisId={chapter.id}
                    sectionId={section.id}
                    onUpdate={() => {}}
                  />
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  );
};
