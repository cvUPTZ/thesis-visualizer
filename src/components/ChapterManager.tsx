import React from 'react';
import { Chapter } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { BookOpen, PlusCircle } from 'lucide-react';
import { ChapterItem } from './editor/chapters/ChapterItem';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { ChapterCreationDialog } from './editor/chapters/ChapterCreationDialog';

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
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const { toast } = useToast();

  const toggleChapter = (chapterId: string) => {
    setOpenChapters(prev => 
      prev.includes(chapterId) 
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const handleCreateChapter = (chapter: Chapter) => {
    onAddChapter();
    toast({
      title: "Chapter Added",
      description: "New chapter has been created successfully",
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center bg-editor-bg p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-serif font-semibold text-editor-text">Chapters</h2>
        </div>
        <Button 
          onClick={() => setShowCreateDialog(true)} 
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white transition-colors duration-200 px-6 py-2 rounded-lg shadow-sm hover:shadow-md"
        >
          <PlusCircle className="w-5 h-5" />
          Add Chapter
        </Button>
      </div>

      <div className="space-y-4">
        {chapters.map((chapter, index) => (
          <ChapterItem
            key={chapter.id}
            chapter={chapter}
            chapterNumber={index + 1}
            isOpen={openChapters.includes(chapter.id)}
            onToggle={() => toggleChapter(chapter.id)}
            onUpdateChapter={onUpdateChapter}
          />
        ))}
      </div>

      <ChapterCreationDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onChapterCreate={handleCreateChapter}
      />
    </div>
  );
};