import React from 'react';
import { Chapter, Section } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SectionItem } from '../sections/SectionItem';
import { 
  PlusCircle, 
  MoveVertical,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useToast } from '@/hooks/use-toast';

interface ChapterItemProps {
  chapter: Chapter;
  isOpen: boolean;
  onToggle: () => void;
  onUpdateChapter: (chapter: Chapter) => void;
}

export const ChapterItem: React.FC<ChapterItemProps> = ({
  chapter,
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

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onToggle}
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
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-editor-text" />
        ) : (
          <ChevronDown className="w-5 h-5 text-editor-text" />
        )}
      </CollapsibleTrigger>

      <CollapsibleContent className="p-4 pt-0 space-y-4">
        {chapter.sections.map((section) => (
          <SectionItem
            key={section.id}
            section={section}
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
        <Button
          onClick={handleAddSection}
          variant="outline"
          className="w-full mt-4 flex items-center justify-center gap-2 hover:bg-editor-hover"
        >
          <PlusCircle className="w-4 h-4" />
          Add Section
        </Button>
      </CollapsibleContent>
    </Collapsible>
  );
};