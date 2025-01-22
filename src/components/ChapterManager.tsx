import React from 'react';
import { Chapter, Section, SectionType } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { BookOpen, PlusCircle, Trash2 } from 'lucide-react';
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
import { createEmptySection } from '@/utils/thesisUtils';

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
    const sectionPath = sectionType.toLowerCase().replace(/ /g, '-') as SectionType;
    
    // Create a new section using the utility function
    const newSection = createEmptySection(sectionPath);

    // Navigate to the section
    navigate(`/thesis/${thesisId}/section/${sectionPath}`);
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
            className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
            onClick={() => handleNavigateToSection(section.title)}
          >
            <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
            <p className="text-sm text-muted-foreground">{section.description}</p>
          </Card>
        ))}
        <Card
          className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 border-dashed border-2 hover:scale-105"
          onClick={() => setShowCreateDialog(true)}
        >
          <div className="flex flex-col items-center justify-center h-full text-center">
            <PlusCircle className="w-8 h-8 mb-2 text-muted-foreground" />
            <h3 className="text-lg font-semibold">New Chapter</h3>
            <p className="text-sm text-muted-foreground">Add a new chapter to your thesis</p>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        {chapters.map((chapter) => (
          <ChapterItem
            key={chapter.id}
            chapter={chapter}
            chapterNumber={chapters.findIndex(c => c.id === chapter.id) + 1}
            isOpen={openChapters.includes(chapter.id)}
            onToggle={() => setOpenChapters(prev => 
              prev.includes(chapter.id) 
                ? prev.filter(id => id !== chapter.id)
                : [...prev, chapter.id]
            )}
            onUpdateChapter={onUpdateChapter}
            isSelected={chaptersToDelete.includes(chapter.id)}
            onSelect={() => setChaptersToDelete(prev =>
              prev.includes(chapter.id)
                ? prev.filter(id => id !== chapter.id)
                : [...prev, chapter.id]
            )}
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