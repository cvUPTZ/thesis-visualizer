import React, { useState, useCallback } from 'react';
import { Chapter, Section } from '@/types/thesis';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, GripVertical, ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from '@/components/ui/use-toast';

interface ChapterManagerProps {
  chapters: Chapter[];
  onUpdateChapter: (chapter: Chapter) => void;
  onAddChapter: (chapter: Chapter) => void;
  onDeleteChapter?: (chapterId: string) => void;
  disabled?: boolean;
}

export const ChapterManager = React.memo(({
  chapters = [],
  onUpdateChapter,
  onAddChapter,
  onDeleteChapter,
  disabled = false
}: ChapterManagerProps) => {
  const [expandedChapters, setExpandedChapters] = useState<string[]>([]);
  const [editingChapter, setEditingChapter] = useState<string | null>(null);

  const handleAddChapter = useCallback(() => {
    const newChapter: Chapter = {
      id: crypto.randomUUID(),
      title: 'New Chapter',
      content: '',
      order: chapters.length,
      sections: [],
      figures: []
    };
    
    console.log('Creating new chapter:', newChapter);
    onAddChapter(newChapter);
    setExpandedChapters(prev => [...prev, newChapter.id]);
    setEditingChapter(newChapter.id);
    
    toast({
      title: "Chapter Created",
      description: "A new chapter has been added to your thesis.",
    });
  }, [chapters.length, onAddChapter]);

  const handleChapterTitleChange = useCallback((chapterId: string, newTitle: string) => {
    const chapter = chapters.find(c => c.id === chapterId);
    if (!chapter) return;

    const updatedChapter = {
      ...chapter,
      title: newTitle
    };

    console.log('Updating chapter title:', { chapterId, newTitle });
    onUpdateChapter(updatedChapter);
  }, [chapters, onUpdateChapter]);

  const handleDeleteChapter = useCallback((chapterId: string) => {
    if (!onDeleteChapter) return;
    
    console.log('Deleting chapter:', chapterId);
    onDeleteChapter(chapterId);
    
    setExpandedChapters(prev => prev.filter(id => id !== chapterId));
    setEditingChapter(null);
    
    toast({
      title: "Chapter Deleted",
      description: "The chapter has been removed from your thesis.",
    });
  }, [onDeleteChapter]);

  const toggleChapter = useCallback((chapterId: string) => {
    setExpandedChapters(prev => 
      prev.includes(chapterId) 
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-lg font-semibold">Chapters</Label>
        <Button
          onClick={handleAddChapter}
          disabled={disabled}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
          Add Chapter
        </Button>
      </div>

      <div className="space-y-2">
        {chapters.map((chapter, index) => (
          <Card key={chapter.id} className="p-4">
            <Collapsible
              open={expandedChapters.includes(chapter.id)}
              onOpenChange={() => toggleChapter(chapter.id)}
            >
              <div className="flex items-center gap-2">
                <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-1">
                    {expandedChapters.includes(chapter.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CollapsibleTrigger>
                
                {editingChapter === chapter.id ? (
                  <Input
                    value={chapter.title}
                    onChange={(e) => handleChapterTitleChange(chapter.id, e.target.value)}
                    onBlur={() => setEditingChapter(null)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        setEditingChapter(null);
                      }
                    }}
                    className="flex-1"
                    autoFocus
                  />
                ) : (
                  <Button
                    variant="ghost"
                    className="flex-1 justify-start font-normal"
                    onClick={() => setEditingChapter(chapter.id)}
                  >
                    Chapter {index + 1}: {chapter.title}
                  </Button>
                )}
                
                {onDeleteChapter && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteChapter(chapter.id)}
                    className="text-destructive hover:text-destructive/90"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <CollapsibleContent className="pl-9 mt-2">
                <div className="space-y-2">
                  {chapter.sections.map((section, sectionIndex) => (
                    <div key={section.id} className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {index + 1}.{sectionIndex + 1}
                      </span>
                      <span className="text-sm">{section.title}</span>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>
    </div>
  );
});

ChapterManager.displayName = 'ChapterManager';