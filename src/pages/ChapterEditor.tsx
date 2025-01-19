import React from 'react';
import { useParams } from 'react-router-dom';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Chapter } from '@/types/thesis';
import { Skeleton } from '@/components/ui/skeleton';

const ChapterEditor = () => {
  const { chapterId } = useParams();
  const { toast } = useToast();
  const [chapter, setChapter] = React.useState<Chapter | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchChapter = async () => {
      try {
        console.log('Fetching chapter with ID:', chapterId);
        
        const { data: thesisData, error: thesisError } = await supabase
          .from('theses')
          .select('content')
          .maybeSingle();

        if (thesisError) {
          console.error('Error fetching thesis:', thesisError);
          throw thesisError;
        }

        if (!thesisData) {
          console.error('No thesis found');
          throw new Error('Thesis not found');
        }

        // Parse the content properly
        const content = typeof thesisData.content === 'string' 
          ? JSON.parse(thesisData.content) 
          : thesisData.content;

        console.log('Thesis content:', content);

        if (!content || !Array.isArray(content.chapters)) {
          console.error('Invalid thesis content structure');
          throw new Error('Invalid thesis structure');
        }

        const foundChapter = content.chapters.find((ch: Chapter) => ch.id === chapterId);

        if (foundChapter) {
          console.log('Found chapter:', foundChapter);
          setChapter(foundChapter);
        } else {
          console.error('Chapter not found:', chapterId);
          toast({
            title: "Error",
            description: "Chapter not found",
            variant: "destructive"
          });
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
  }, [chapterId, toast]);

  const handleContentChange = async (content: string) => {
    if (!chapter) return;

    try {
      const { data: thesisData, error: thesisError } = await supabase
        .from('theses')
        .select('content')
        .maybeSingle();

      if (thesisError) throw thesisError;
      if (!thesisData) throw new Error('Thesis not found');

      // Parse the existing content
      const existingContent = typeof thesisData.content === 'string' 
        ? JSON.parse(thesisData.content) 
        : thesisData.content;

      // Update the specific chapter
      const updatedChapters = existingContent.chapters.map((ch: Chapter) =>
        ch.id === chapter.id ? { ...ch, content } : ch
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
        .eq('id', thesisData.id);

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
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">{chapter.title}</h1>
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