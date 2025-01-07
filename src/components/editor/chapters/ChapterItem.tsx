import React from 'react';
import { Chapter } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { SectionItem } from '../sections/SectionItem';
import { ChevronDown, ChevronUp, GripVertical } from 'lucide-react';
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
  const handleContentChange = (content: string) => {
    onUpdateChapter({
      ...chapter,
      content
    });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateChapter({
      ...chapter,
      title: e.target.value
    });
  };

  return (
    <div className={cn(
      "border rounded-xl bg-white shadow-sm transition-all duration-200",
      "hover:shadow-md",
      isOpen && "ring-2 ring-primary/10"
    )}>
      <div 
        className="p-4 flex items-center justify-between group cursor-pointer"
        onClick={onToggle}
      >
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
              onChange={handleTitleChange}
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
      </div>

      {isOpen && (
        <div className="p-4 pt-0 space-y-4">
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
        </div>
      )}
    </div>
  );
};