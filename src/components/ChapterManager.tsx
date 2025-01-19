import React, { useCallback, useMemo, useReducer } from 'react';
import { Chapter, Section, ThesisSectionType } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen, PlusCircle, Trash2 } from 'lucide-react';
import { ChapterItem } from './editor/chapters/ChapterItem';
import { useToast } from '@/hooks/use-toast';
import { ChapterCreationDialog } from './editor/chapters/ChapterCreationDialog';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface GeneralIntroduction {
  title: string;
  content: string;
}

interface ChapterManagerProps {
  chapters: Chapter[];
  onUpdateChapter: (chapter: Chapter) => Promise<void>;
  onAddChapter: (chapter: Chapter) => Promise<void>;
  onRemoveChapter: (chapterId: string) => Promise<void>;
  hasGeneralIntroduction: boolean;
  onAddGeneralIntroduction: (intro: GeneralIntroduction) => Promise<void>;
}

interface ChapterManagerState {
  openChapters: string[];
  showCreateDialog: boolean;
  showIntroDialog: boolean;
  chaptersToDelete: string[];
  isDeleting: boolean;
  isCreating: boolean;
}

type ChapterManagerAction = 
  | { type: 'TOGGLE_CHAPTER'; payload: string }
  | { type: 'SET_CREATE_DIALOG'; payload: boolean }
  | { type: 'SET_INTRO_DIALOG'; payload: boolean }
  | { type: 'TOGGLE_CHAPTER_SELECTION'; payload: string }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'SET_DELETING'; payload: boolean }
  | { type: 'SET_CREATING'; payload: boolean };

const initialState: ChapterManagerState = {
  openChapters: [],
  showCreateDialog: false,
  showIntroDialog: false,
  chaptersToDelete: [],
  isDeleting: false,
  isCreating: false,
};

function chapterManagerReducer(state: ChapterManagerState, action: ChapterManagerAction): ChapterManagerState {
  switch (action.type) {
    case 'TOGGLE_CHAPTER':
      return {
        ...state,
        openChapters: state.openChapters.includes(action.payload)
          ? state.openChapters.filter(id => id !== action.payload)
          : [...state.openChapters, action.payload]
      };
    case 'SET_CREATE_DIALOG':
      return { ...state, showCreateDialog: action.payload };
    case 'SET_INTRO_DIALOG':
      return { ...state, showIntroDialog: action.payload };
    case 'TOGGLE_CHAPTER_SELECTION':
      return {
        ...state,
        chaptersToDelete: state.chaptersToDelete.includes(action.payload)
          ? state.chaptersToDelete.filter(id => id !== action.payload)
          : [...state.chaptersToDelete, action.payload]
      };
    case 'CLEAR_SELECTION':
      return { ...state, chaptersToDelete: [] };
    case 'SET_DELETING':
      return { ...state, isDeleting: action.payload };
    case 'SET_CREATING':
      return { ...state, isCreating: action.payload };
    default:
      return state;
  }
}

const GeneralIntroductionEditor: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (intro: GeneralIntroduction) => void;
  isLoading?: boolean;
}> = ({ open, onOpenChange, onSave, isLoading = false }) => {
  const [title, setTitle] = React.useState('');
  const [content, setContent] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ title, content });
    setTitle('');
    setContent('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>General Introduction</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter introduction title..."
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your introduction here..."
              className="min-h-[200px] w-full"
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !title || !content}
            >
              {isLoading ? 'Saving...' : 'Save Introduction'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const createIntroductionSection = (): Section => ({
  id: Date.now().toString(),
  title: "Chapter Introduction",
  content: "",
  type: ThesisSectionType.Introduction,
  order: 0,
  required: true,
  figures: [],
  tables: [],
  citations: [],
  references: []
});

export const ChapterManager: React.FC<ChapterManagerProps> = ({
  chapters,
  onUpdateChapter,
  onAddChapter,
  onRemoveChapter,
  hasGeneralIntroduction = false,
  onAddGeneralIntroduction
}) => {
  const [state, dispatch] = useReducer(chapterManagerReducer, initialState);
  const { toast } = useToast();

  const chapterNumbers = useMemo(() => 
    Object.fromEntries(chapters.map((chapter, index) => [chapter.id, index + 1])),
    [chapters]
  );

  const toggleChapter = useCallback((chapterId: string) => {
    dispatch({ type: 'TOGGLE_CHAPTER', payload: chapterId });
  }, []);

  const toggleChapterSelection = useCallback((chapterId: string) => {
    dispatch({ type: 'TOGGLE_CHAPTER_SELECTION', payload: chapterId });
  }, []);

  const handleCreateChapter = useCallback(async (chapter: Chapter) => {
    if (!hasGeneralIntroduction) {
      toast({
        title: "General Introduction Required",
        description: "Please add a general introduction before creating chapters",
        variant: "destructive"
      });
      return;
    }

    try {
      dispatch({ type: 'SET_CREATING', payload: true });
      const chapterWithIntro: Chapter = {
        ...chapter,
        sections: [createIntroductionSection(), ...chapter.sections]
      };
      
      await onAddChapter(chapterWithIntro);
      toast({
        title: "Chapter Added",
        description: "New chapter has been created successfully",
      });
    } catch (error) {
      toast({
        title: "Error Creating Chapter",
        description: "Failed to create new chapter. Please try again.",
        variant: "destructive"
      });
    } finally {
      dispatch({ type: 'SET_CREATING', payload: false });
      dispatch({ type: 'SET_CREATE_DIALOG', payload: false });
    }
  }, [hasGeneralIntroduction, onAddChapter, toast]);

  const handleSaveIntroduction = useCallback(async (introData: GeneralIntroduction) => {
    try {
      dispatch({ type: 'SET_CREATING', payload: true });
      await onAddGeneralIntroduction(introData);
      toast({
        title: "General Introduction Added",
        description: "General introduction has been created successfully",
      });
      dispatch({ type: 'SET_INTRO_DIALOG', payload: false });
    } catch (error) {
      toast({
        title: "Error Creating Introduction",
        description: "Failed to create general introduction. Please try again.",
        variant: "destructive"
      });
    } finally {
      dispatch({ type: 'SET_CREATING', payload: false });
    }
  }, [onAddGeneralIntroduction, toast]);

  const handleDeleteChapters = useCallback(async () => {
    if (!onRemoveChapter || state.chaptersToDelete.length === 0) return;

    try {
      dispatch({ type: 'SET_DELETING', payload: true });
      await Promise.all(
        state.chaptersToDelete.map(chapterId => onRemoveChapter(chapterId))
      );
      toast({
        title: "Chapters Deleted",
        description: `${state.chaptersToDelete.length} chapter(s) have been removed successfully`,
      });
      dispatch({ type: 'CLEAR_SELECTION' });
    } catch (error) {
      toast({
        title: "Error Deleting Chapters",
        description: "Failed to delete one or more chapters. Please try again.",
        variant: "destructive"
      });
    } finally {
      dispatch({ type: 'SET_DELETING', payload: false });
    }
  }, [onRemoveChapter, state.chaptersToDelete, toast]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header section */}
      <div className="flex justify-between items-center bg-editor-bg p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-serif font-semibold text-editor-text">Chapters</h2>
        </div>
        <div className="flex items-center gap-2">
          {!hasGeneralIntroduction && (
            <Button
              onClick={() => dispatch({ type: 'SET_INTRO_DIALOG', payload: true })}
              className="flex items-center gap-2"
              variant="outline"
            >
              <PlusCircle className="w-5 h-5" />
              Add General Introduction
            </Button>
          )}
          {state.chaptersToDelete.length > 0 && (
            <Button 
              onClick={() => dispatch({ type: 'CLEAR_SELECTION' })}
              variant="ghost"
              className="text-muted-foreground"
            >
              Clear Selection ({state.chaptersToDelete.length})
            </Button>
          )}
          <Button 
            onClick={() => dispatch({ type: 'SET_CREATE_DIALOG', payload: true })}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white transition-colors duration-200 px-6 py-2 rounded-lg shadow-sm hover:shadow-md"
            disabled={!hasGeneralIntroduction || state.isCreating}
          >
            <PlusCircle className="w-5 h-5" />
            {state.isCreating ? 'Creating...' : 'Add Chapter'}
          </Button>
        </div>
      </div>

      {/* Chapters list */}
      <div className="space-y-4">
        {chapters.map((chapter) => (
          <ChapterItem
            key={chapter.id}
            chapter={chapter}
            chapterNumber={chapterNumbers[chapter.id]}
            isOpen={state.openChapters.includes(chapter.id)}
            onToggle={() => toggleChapter(chapter.id)}
            onUpdateChapter={onUpdateChapter}
            isSelected={state.chaptersToDelete.includes(chapter.id)}
            onSelect={() => toggleChapterSelection(chapter.id)}
          />
        ))}
      </div>

      {/* Delete action button */}
      {state.chaptersToDelete.length > 0 && !state.isDeleting && (
        <div className="fixed bottom-4 right-4 bg-background border rounded-lg shadow-lg p-4 animate-slide-in-right">
          <Button
            onClick={() => handleDeleteChapters()}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete {state.chaptersToDelete.length} Selected
          </Button>
        </div>
      )}

      {/* Dialogs */}
      <ChapterCreationDialog
        open={state.showCreateDialog}
        onOpenChange={(open) => dispatch({ type: 'SET_CREATE_DIALOG', payload: open })}
        onChapterCreate={handleCreateChapter}
      />

      <GeneralIntroductionEditor
        open={state.showIntroDialog}
        onOpenChange={(open) => dispatch({ type: 'SET_INTRO_DIALOG', payload: open })}
        onSave={handleSaveIntroduction}
        isLoading={state.isCreating}
      />

      <AlertDialog 
        open={state.isDeleting} 
        onOpenChange={(open) => !open && dispatch({ type: 'SET_DELETING', payload: false })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deleting Chapters</AlertDialogTitle>
            <AlertDialogDescription>
              Removing {state.chaptersToDelete.length} chapter(s)...
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};