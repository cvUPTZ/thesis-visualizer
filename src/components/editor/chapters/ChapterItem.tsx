import React, { useState } from 'react';
import { Chapter } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronDown, ChevronUp, GripVertical, PlusCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChapterContent } from './ChapterContent';
import { ChapterFigures } from './ChapterFigures';
import { ChapterTables } from './ChapterTables';
import { ChapterCitations } from './ChapterCitations';
import { ChapterReferences } from './ChapterReferences';

interface ChapterItemProps {
  chapter: Chapter;
  chapterNumber: number;
  isOpen: boolean;
  onToggle: () => void;
  onUpdateChapter: (chapter: Chapter) => void;
  onDeleteChapter?: () => void;
}

export const ChapterItem: React.FC<ChapterItemProps> = ({
  chapter,
  chapterNumber,
  isOpen,
  onToggle,
  onUpdateChapter,
  onDeleteChapter
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('content');

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
          {onDeleteChapter && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteChapter();
              }}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="figures">Figures</TabsTrigger>
              <TabsTrigger value="tables">Tables</TabsTrigger>
              <TabsTrigger value="citations">Citations</TabsTrigger>
              <TabsTrigger value="references">References</TabsTrigger>
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
          </Tabs>
        </div>
      )}
    </div>
  );
};