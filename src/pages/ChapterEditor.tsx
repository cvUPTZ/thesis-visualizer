import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Chapter } from '@/types/thesis';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface ThesisData {
  id: string;
  content: {
    chapters: Chapter[];
  };
}

const ChapterEditor = () => {
  const { chapterId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [chapter, setChapter] = React.useState<Chapter | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [thesisId, setThesisId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchChapter = async () => {
      try {
        if (!chapterId) {
          throw new Error('No chapter ID provided');
        }

        console.log('Fetching chapter with ID:', chapterId);
        
        // Get all theses that contain this chapter
        const { data: thesesData, error: thesesError } = await supabase
          .from('theses')
          .select('id, content')
          .returns<ThesisData[]>();

        if (thesesError) {
          console.error('Error fetching theses:', thesesError);
          throw thesesError;
        }

        // Find the thesis containing our chapter
        let foundChapter: Chapter | null = null;
        let foundThesisId: string | null = null;

        for (const thesis of thesesData) {
          const content = typeof thesis.content === 'string' 
            ? JSON.parse(thesis.content) 
            : thesis.content;

          if (!content?.chapters || !Array.isArray(content.chapters)) {
            continue;
          }

          // Try both string and numeric ID matching
          const chapter = content.chapters.find((ch: Chapter) => {
            const chapterIdStr = String(ch.id);
            const searchIdStr = String(chapterId);
            return chapterIdStr === searchIdStr;
          });

          if (chapter) {
            foundChapter = chapter;
            foundThesisId = thesis.id;
            break;
          }
        }

        if (foundChapter && foundThesisId) {
          console.log('Found chapter in thesis:', foundThesisId);
          setChapter(foundChapter);
          setThesisId(foundThesisId);
        } else {
          console.error('Chapter not found:', chapterId);
          toast({
            title: "Error",
            description: "Chapter not found. Redirecting back to thesis...",
            variant: "destructive"
          });
          // Navigate back to thesis if we have the thesis ID
          if (foundThesisId) {
            navigate(`/thesis/${foundThesisId}`);
          } else {
            navigate('/');
          }
        }
      } catch (error: any) {
        console.error('Error fetching chapter:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load chapter",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (chapterId) {
      fetchChapter();
    }
  }, [chapterId, toast, navigate]);

  const handleContentChange = async (content: string) => {
    if (!chapter || !thesisId) return;

    try {
      // Get the thesis data directly using the stored thesis ID
      const { data: thesisData, error: thesisError } = await supabase
        .from('theses')
        .select('content')
        .eq('id', thesisId)
        .maybeSingle();

      if (thesisError) throw thesisError;
      if (!thesisData) throw new Error('Thesis not found');

      // Parse the existing content
      const existingContent = typeof thesisData.content === 'string' 
        ? JSON.parse(thesisData.content) 
        : thesisData.content;

      // Update the specific chapter
      const updatedChapters = existingContent.chapters.map((ch: Chapter) =>
        String(ch.id) === String(chapter.id) ? { ...ch, content } : ch
      );

      // Prepare the updated content
      const updatedContent = {
        ...existingContent,
        chapters: updatedChapters
      };

      const { error: updateError } = await supabase
        .from('theses')
        .update({
          content: updatedContent
        })
        .eq('id', thesisId);

      if (updateError) throw updateError;

      setChapter({ ...chapter, content });

      toast({
        title: "Success",
        description: "Chapter content updated",
      });
    } catch (error: any) {
      console.error('Error updating chapter:', error);
      toast({
        title: "Error",
        description: "Failed to update chapter",
        variant: "destructive"
      });
    }
  };

  const handleBack = () => {
    if (thesisId) {
      navigate(`/thesis/${thesisId}`);
    } else {
      navigate('/');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Card className="p-6">
          <Skeleton className="h-[400px] w-full" />
        </Card>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-destructive">Chapter Not Found</h2>
          <p className="text-muted-foreground">The requested chapter could not be found.</p>
          <Button onClick={handleBack} variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Thesis
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button onClick={handleBack} variant="outline" size="sm" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Thesis
        </Button>
        <h1 className="text-3xl font-bold">{chapter.title}</h1>
      </div>
      <Card className="p-6">
        <MarkdownEditor
          value={chapter.content}
          onChange={(value) => handleContentChange(value || '')}
          placeholder="Start writing your chapter content..."
        />
      </Card>
    </div>
  );
};

export default ChapterEditor;