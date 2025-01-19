import React from 'react';
import { Chapter } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Image, 
  Table as TableIcon, 
  BookOpen,
  Library,
  PlusCircle
} from 'lucide-react';
import { ChapterCreationDialog } from '../editor/chapters/ChapterCreationDialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCreateChapter = async (chapter: Chapter) => {
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

      // Then persist it to Supabase
      const { error } = await supabase
        .from('theses')
        .update({
          content: JSON.parse(JSON.stringify({ chapters: chaptersJson }))
        })
        .eq('id', thesisId);

      if (error) throw error;

      setShowCreateDialog(false);
      toast({
        title: "Chapter Created",
        description: "Redirecting to chapter editor...",
      });

      // Navigate to the new chapter's editor page
      navigate(`/chapter/${chapter.id}`);

    } catch (error) {
      console.error('Error creating chapter:', error);
      toast({
        title: "Error",
        description: "Failed to create chapter. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-64 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <ScrollArea className="h-full py-6">
        <div className="space-y-4 px-2">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-lg font-semibold">Chapters</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCreateDialog(true)}
              className="h-8 px-2"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="sr-only">Add Chapter</span>
            </Button>
          </div>
          
          <div className="space-y-1">
            {chapters.map((chapter, index) => (
              <Button
                key={chapter.id}
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={() => navigate(`/chapter/${chapter.id}`)}
              >
                <BookOpen className="h-5 w-5" />
                Chapter {index + 1}: {chapter.title}
              </Button>
            ))}
          </div>

          <div className="space-y-1 mt-6">
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Image className="h-5 w-5" />
              Figures
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <TableIcon className="h-5 w-5" />
              Tables
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Library className="h-5 w-5" />
              Bibliography
            </Button>
          </div>
        </div>
      </ScrollArea>

      <ChapterCreationDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onChapterCreate={handleCreateChapter}
      />
    </div>
  );
};