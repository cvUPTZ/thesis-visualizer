import React from 'react';
import { Chapter, Section } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { useToast } from '@/hooks/use-toast';
import { SectionItem } from '../sections/SectionItem';

interface ChapterContentProps {
  chapter: Chapter;
  onUpdateChapter: (chapter: Chapter) => void;
}

export const ChapterContent: React.FC<ChapterContentProps> = ({
  chapter,
  onUpdateChapter
}) => {
  const { toast } = useToast();

  const handleAddSection = () => {
    const newSection: Section = {
      id: Date.now().toString(),
      title: 'New Section',
      content: '',
      type: 'custom',
      order: chapter.sections.length + 1,
      figures: [],
      tables: [],
      citations: [],
      references: [],
      tasks: []
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

  const handleRemoveSection = (sectionId: string) => {
    onUpdateChapter({
      ...chapter,
      sections: chapter.sections.filter(s => s.id !== sectionId)
    });

    toast({
      title: "Section Removed",
      description: "Section has been removed from the chapter",
    });
  };

  return (
    <div className="pt-4 border-t space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Chapter Introduction</label>
        <MarkdownEditor
          value={chapter.content || ''}
          onChange={(value) => onUpdateChapter({
            ...chapter,
            content: value || ''
          })}
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
            className="gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Add Section
          </Button>
        </div>

        <div className="space-y-4">
          {chapter.sections.map((section, index) => (
            <div key={section.id} className="group relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveSection(section.id)}
                className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <SectionItem
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
