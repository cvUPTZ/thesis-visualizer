import React from 'react';
import { Chapter } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { BookOpen, PlusCircle, Trash2 } from 'lucide-react';
import { ChapterItem } from './editor/chapters/ChapterItem';
import { useToast } from '@/hooks/use-toast';
import { ChapterCreationDialog } from './editor/chapters/ChapterCreationDialog';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ChapterManagerProps {
  chapters: Chapter[];
  onUpdateChapter: (chapter: Chapter) => void;
  onAddChapter: (chapter: Chapter) => void;
  onRemoveChapter?: (chapterId: string) => void;
}

export const ChapterManager: React.FC<ChapterManagerProps> = ({
  chapters,
  onUpdateChapter,
  onAddChapter,
  onRemoveChapter
}) => {
  const [openChapters, setOpenChapters] = React.useState<string[]>([]);
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [chaptersToDelete, setChaptersToDelete] = React.useState<string[]>([]);
  const { toast } = useToast();

  const toggleChapter = (chapterId: string) => {
    setOpenChapters(prev => 
      prev.includes(chapterId) 
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const toggleChapterSelection = (chapterId: string) => {
    setChaptersToDelete(prev =>
      prev.includes(chapterId)
        ? prev.filter(id => id !== chapterId)
        : [...prev, chapterId]
    );
  };

  const handleCreateChapter = async (chapter: Chapter) => {
    console.log('Creating new chapter:', chapter);
    try {
      // First, add the chapter to the local state
      onAddChapter(chapter);
      
      // Convert chapters array to a JSON-compatible format
      const chaptersJson = [...chapters, chapter].map(ch => ({
        id: ch.id,
        title: ch.title,
        content: ch.content,
        sections: ch.sections,
        part: ch.part,
        figures: ch.figures,
        tables: ch.tables,
        footnotes: ch.footnotes
      }));

      // Then persist it to Supabase with proper type casting
      const { error } = await supabase
        .from('theses')
        .update({
          content: { chapters: chaptersJson } as Json
        })
        .eq('id', chapter.id);

      if (error) throw error;

      setShowCreateDialog(false);
      toast({
        title: "Chapter Added",
        description: "New chapter has been created successfully",
      });

    } catch (error) {
      console.error('Error creating chapter:', error);
      toast({
        title: "Error",
        description: "Failed to create chapter. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteChapters = async () => {
    if (onRemoveChapter && chaptersToDelete.length > 0) {
      try {
        // First remove from local state
        chaptersToDelete.forEach(chapterId => {
          onRemoveChapter(chapterId);
        });

        // Convert remaining chapters to JSON-compatible format
        const updatedChapters = chapters
          .filter(chapter => !chaptersToDelete.includes(chapter.id))
          .map(ch => ({
            id: ch.id,
            title: ch.title,
            content: ch.content,
            sections: ch.sections,
            part: ch.part,
            figures: ch.figures,
            tables: ch.tables,
            footnotes: ch.footnotes
          }));

        const { error } = await supabase
          .from('theses')
          .update({
            content: { chapters: updatedChapters } as Json
          })
          .eq('id', chapters[0]?.id);

        if (error) throw error;

        setChaptersToDelete([]);
        toast({
          title: "Chapters Deleted",
          description: `${chaptersToDelete.length} chapter(s) have been removed successfully`,
        });
      } catch (error) {
        console.error('Error deleting chapters:', error);
        toast({
          title: "Error",
          description: "Failed to delete chapters. Please try again.",
          variant: "destructive"
        });
      }
    }
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
        <div className="flex items-center gap-2">
          {chaptersToDelete.length > 0 && (
            <Button 
              onClick={() => setChaptersToDelete([])}
              variant="ghost"
              className="text-muted-foreground"
            >
              Clear Selection ({chaptersToDelete.length})
            </Button>
          )}
          <Button 
            onClick={() => setShowCreateDialog(true)} 
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white transition-colors duration-200 px-6 py-2 rounded-lg shadow-sm hover:shadow-md"
          >
            <PlusCircle className="w-5 h-5" />
            Add Chapter
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {chapters.map((chapter) => (
          <ChapterItem
            key={chapter.id}
            chapter={chapter}
            chapterNumber={chapters.findIndex(c => c.id === chapter.id) + 1}
            isOpen={openChapters.includes(chapter.id)}
            onToggle={() => toggleChapter(chapter.id)}
            onUpdateChapter={onUpdateChapter}
            isSelected={chaptersToDelete.includes(chapter.id)}
            onSelect={() => toggleChapterSelection(chapter.id)}
          />
        ))}
      </div>

      {chaptersToDelete.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-background border rounded-lg shadow-lg p-4 animate-slide-in-right">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">
              {chaptersToDelete.length} chapter(s) selected
            </span>
            <Button
              onClick={() => handleDeleteChapters()}
              variant="destructive"
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected
            </Button>
          </div>
        </div>
      )}

      <ChapterCreationDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onChapterCreate={handleCreateChapter}
      />

      <AlertDialog open={chaptersToDelete.length > 0} onOpenChange={(open) => !open && setChaptersToDelete([])}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete {chaptersToDelete.length} chapter(s) and all their contents.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteChapters}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};