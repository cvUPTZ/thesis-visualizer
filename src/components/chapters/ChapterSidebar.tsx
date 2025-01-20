import React from 'react';
import { Chapter } from '@/types/thesis';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChapterManager } from '@/components/ChapterManager';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ChapterCreationDialog } from '@/components/editor/chapters/ChapterCreationDialog';

interface ChapterSidebarProps {
  chapters: Chapter[];
  onUpdateChapter: (chapter: Chapter) => void;
  onAddChapter: (chapter: Chapter) => void;
  thesisId: string;
}

export const ChapterSidebar: React.FC<ChapterSidebarProps> = ({
  chapters,
  onUpdateChapter,
  onAddChapter,
  thesisId
}) => {
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);

  console.log('Rendering ChapterSidebar with:', { 
    chaptersCount: chapters?.length,
    thesisId 
  });

  return (
    <div className="w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="p-4 border-b">
        <Button 
          onClick={() => setShowCreateDialog(true)}
          className="w-full flex items-center gap-2"
          variant="outline"
        >
          <Plus className="h-4 w-4" />
          New Chapter
        </Button>
      </div>
      <ScrollArea className="h-[calc(100vh-5rem)] py-6">
        <div className="px-2">
          <ChapterManager
            chapters={chapters}
            onUpdateChapter={onUpdateChapter}
            onAddChapter={onAddChapter}
          />
        </div>
      </ScrollArea>

      <ChapterCreationDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onChapterCreate={onAddChapter}
      />
    </div>
  );
};