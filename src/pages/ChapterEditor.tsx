import React from 'react';
import { useParams } from 'react-router-dom';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Chapter } from '@/types/thesis';

const ChapterEditor = () => {
  const { chapterId } = useParams();
  const { toast } = useToast();
  const [chapter, setChapter] = React.useState<Chapter | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchChapter = async () => {
      try {
        const { data: theses, error } = await supabase
          .from('theses')
          .select('content')
          .single();

        if (error) throw error;

        const chapters = theses.content.chapters || [];
        const foundChapter = chapters.find((ch: Chapter) => ch.id === chapterId);

        if (foundChapter) {
          setChapter(foundChapter);
        } else {
          toast({
            title: "Error",
            description: "Chapter not found",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error fetching chapter:', error);
        toast({
          title: "Error",
          description: "Failed to load chapter",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchChapter();
  }, [chapterId, toast]);

  const handleContentChange = async (content: string) => {
    if (!chapter) return;

    try {
      const updatedChapter = { ...chapter, content };
      setChapter(updatedChapter);

      const { error } = await supabase
        .from('theses')
        .update({
          content: JSON.parse(JSON.stringify({ chapters: [updatedChapter] }))
        })
        .eq('id', chapter.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Chapter content updated",
      });
    } catch (error) {
      console.error('Error updating chapter:', error);
      toast({
        title: "Error",
        description: "Failed to update chapter",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!chapter) {
    return <div>Chapter not found</div>;
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