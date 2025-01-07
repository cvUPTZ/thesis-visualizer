import React from 'react';
import { Chapter } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { BookOpen, PlusCircle } from 'lucide-react';
import { ChapterItem } from './editor/chapters/ChapterItem';
import { useToast } from '@/hooks/use-toast';

interface ChapterManagerProps {
  chapters: Chapter[];
  onUpdateChapter: (chapter: Chapter) => void;
  onAddChapter: () => void;
}

export const ChapterManager: React.FC<ChapterManagerProps> = ({
  chapters,
  onUpdateChapter,
  onAddChapter
}) => {
  const [openChapters, setOpenChapters] = React.useState<string[]>([]);
  const { toast } = useToast();

  const toggleChapter = (chapterId: string) => {
    setOpenChapters(prev => 
      prev.includes(chapterId) 
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  console.log('ChapterManager rendering with chapters:', chapters.length);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center bg-editor-bg p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          <h2 className="text-2xl font-serif font-semibold">Chapters</h2>
        </div>
        <Button 
          onClick={() => {
            onAddChapter();
            toast({
              title: "Chapter Added",
              description: "New chapter has been created",
            });
          }} 
          className="flex items-center gap-2 bg-editor-accent hover:bg-editor-accent-hover transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Add Chapter
        </Button>
      </div>

      <div className="space-y-4">
        {chapters.map((chapter) => (
          <ChapterItem
            key={chapter.id}
            chapter={chapter}
            isOpen={openChapters.includes(chapter.id)}
            onToggle={() => toggleChapter(chapter.id)}
            onUpdateChapter={onUpdateChapter}
          />
        ))}
      </div>
    </div>
  );
};