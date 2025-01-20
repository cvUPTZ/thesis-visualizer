import React from 'react';
import { Chapter } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { BookOpen, PlusCircle, Trash2, ChevronDown } from 'lucide-react';
import { ChapterItem } from './editor/chapters/ChapterItem';
import { useToast } from '@/hooks/use-toast';
import { ChapterCreationDialog } from './editor/chapters/ChapterCreationDialog';
import { useNavigate } from 'react-router-dom';
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
import { Card } from './ui/card';

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
  const navigate = useNavigate();

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

  const handleCreateChapter = (chapter: Chapter) => {
    console.log('Handling chapter creation:', chapter);
    onAddChapter(chapter);
    toast({
      title: "Chapter Added",
      description: "New chapter has been created successfully",
    });
  };

  const handleNavigateToSection = (sectionType: string) => {
    const thesisId = window.location.pathname.split('/')[2];
    navigate(`/thesis/${thesisId}/section/${sectionType.toLowerCase().replace(/ /g, '-')}`);
  };

  const handleDeleteChapters = () => {
    if (onRemoveChapter && chaptersToDelete.length > 0) {
      console.log('Deleting chapters:', chaptersToDelete);
      chaptersToDelete.forEach(chapterId => {
        onRemoveChapter(chapterId);
      });
      setChaptersToDelete([]);
      toast({
        title: "Chapters Deleted",
        description: `${chaptersToDelete.length} chapter(s) have been removed successfully`,
      });
    }
  };

  const sectionTypes = [
    {
      title: "Thesis Structure Overview",
      description: "Outline the structure and organization of your thesis"
    },
    {
      title: "General Introduction",
      description: "Introduce your research topic and objectives"
    },
    {
      title: "Abstract",
      description: "Summarize your research and findings"
    },
    {
      title: "Acknowledgements",
      description: "Thank those who supported your research"
    },
    {
      title: "General Conclusion",
      description: "Summarize your findings and conclusions"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sectionTypes.map((section) => (
          <Card
            key={section.title}
            className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200"
            onClick={() => handleNavigateToSection(section.title)}
          >
            <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
            <p className="text-sm text-muted-foreground">{section.description}</p>
          </Card>
        ))}
        <Card
          className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 border-dashed border-2"
          onClick={() => setShowCreateDialog(true)}
        >
          <div className="flex flex-col items-center justify-center h-full text-center">
            <PlusCircle className="w-8 h-8 mb-2 text-muted-foreground" />
            <h3 className="text-lg font-semibold">New Chapter</h3>
            <p className="text-sm text-muted-foreground">Add a new chapter to your thesis</p>
          </div>
        </Card>
      </div>

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