import React from 'react';
import { Chapter, Section } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SectionItem } from '../sections/SectionItem';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { 
  PlusCircle, 
  GripVertical,
  ChevronDown,
  ChevronUp,
  BookOpen,
  FileText
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ChapterItemProps {
  chapter: Chapter;
  chapterNumber: number;
  isOpen: boolean;
  onToggle: () => void;
  onUpdateChapter: (chapter: Chapter) => void;
}

export const ChapterItem: React.FC<ChapterItemProps> = ({
  chapter,
  chapterNumber,
  isOpen,
  onToggle,
  onUpdateChapter,
}) => {
  const { toast } = useToast();

  const handleAddSection = () => {
    console.log('Adding new section to chapter:', chapter.id);
    
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

    toast({
      title: "Section Added",
      description: "New section has been added to the chapter",
    });
  };

  const handleContentChange = (content: string) => {
    onUpdateChapter({
      ...chapter,
      content: content
    });
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onToggle}
      className={cn(
        "border rounded-xl bg-white shadow-sm transition-all duration-200",
        "hover:shadow-md",
        isOpen && "ring-2 ring-primary/10"
      )}
    >
      <CollapsibleTrigger className="w-full p-4 flex items-center justify-between group">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
            <GripVertical className="w-4 h-4 text-gray-500" />
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 text-primary font-medium px-3 py-1 rounded-md">
              Ch. {chapterNumber}
            </div>
            <Input
              value={chapter.title}
              onChange={(e) => onUpdateChapter({ ...chapter, title: e.target.value })}
              className="text-xl font-serif border-none bg-transparent px-0 focus-visible:ring-0 w-full min-w-[300px]"
              placeholder="Chapter Title"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {chapter.sections.length} {chapter.sections.length === 1 ? 'section' : 'sections'}
          </span>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </CollapsibleTrigger>

      <CollapsibleContent className="p-4 pt-0 space-y-4">
        <div className="pt-4 border-t space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Chapter Introduction</label>
            <MarkdownEditor
              value={chapter.content || ''}
              onChange={handleContentChange}
              placeholder="Write your chapter introduction here..."
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Sections</h3>
              <Button
                onClick={handleAddSection}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Add Section
              </Button>
            </div>

            <div className="space-y-4">
              {chapter.sections.map((section, index) => (
                <SectionItem
                  key={section.id}
                  section={section}
                  sectionNumber={index + 1}
                  onUpdateSection={(updatedSection) => {
                    onUpdateChapter({
                      ...chapter,
                      sections: chapter.sections.map((s) =>
                        s.id === updatedSection.id ? updatedSection : s
                      ),
                    });
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};