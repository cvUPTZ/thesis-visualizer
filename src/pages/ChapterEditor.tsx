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
import { Json } from '@/integrations/supabase/types';

interface ThesisContent {
  chapters: Chapter[];
  metadata?: Record<string, any>;
  frontMatter?: any[];
  backMatter?: any[];
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
        console.log('Fetching chapter with ID:', chapterId);
        setLoading(true);

        const { data: theses, error: thesesError } = await supabase
          .from('theses')
          .select('id, content')
          .eq('content->chapters', chapterId);

        if (thesesError) {
          throw thesesError;
        }

        let foundChapter = null;
        let foundThesisId = null;

        for (const thesis of theses) {
          const content = thesis.content as unknown as ThesisContent;
          if (!content?.chapters) {
            console.log('No chapters found in thesis:', thesis.id);
            continue;
          }

          console.log('Searching for chapter in thesis:', thesis.id);
          
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
          console.log('Found chapter:', foundChapter);
          setChapter(foundChapter);
          setThesisId(foundThesisId);
        } else {
          console.error('Chapter not found:', chapterId);
          toast({
            title: "Error",
            description: "Chapter not found. Redirecting back to thesis...",
            variant: "destructive"
          });
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
      console.log('Updating chapter content:', { thesisId, chapterId: chapter.id });

      const { data: thesis, error: fetchError } = await supabase
        .from('theses')
        .select('content')
        .eq('id', thesisId)
        .single();

      if (fetchError) throw fetchError;

      const existingContent = thesis.content as unknown as ThesisContent;

      const updatedChapters = existingContent.chapters.map((ch: Chapter) =>
        String(ch.id) === String(chapter.id) ? { ...ch, content } : ch
      );

      // Convert chapters to a format that matches Supabase's JSON type
      const chaptersJson = updatedChapters.map(ch => ({
        id: ch.id,
        title: ch.title,
        content: ch.content,
        sections: (ch.sections || []).map(section => ({
          id: section.id,
          title: section.title,
          content: section.content,
          type: section.type,
          order: section.order,
          figures: section.figures || [],
          tables: section.tables || [],
          citations: section.citations || [],
          references: section.references || [],
          footnotes: section.footnotes || []
        })),
        part: ch.part || 1,
        figures: (ch.figures || []).map(figure => ({
          id: figure.id,
          imageUrl: figure.imageUrl,
          title: figure.title,
          caption: figure.caption,
          altText: figure.altText,
          number: figure.number,
          dimensions: figure.dimensions
        })),
        tables: (ch.tables || []).map(table => ({
          id: table.id,
          title: table.title || '',
          content: table.content,
          caption: table.caption || ''
        })),
        footnotes: (ch.footnotes || []).map(footnote => ({
          id: footnote.id,
          content: footnote.content,
          number: footnote.number,
          created_at: footnote.created_at,
          updated_at: footnote.updated_at
        }))
      }));

      // Prepare the content object that matches Supabase's JSON type
      const updatedContent = {
        ...existingContent,
        chapters: chaptersJson
      } as unknown as Json;

      const { error: updateError } = await supabase
        .from('theses')
        .update({ content: updatedContent })
        .eq('id', thesisId);

      if (updateError) throw updateError;

      setChapter({ ...chapter, content });

      toast({
        title: "Success",
        description: "Chapter content updated successfully",
      });
    } catch (error: any) {
      console.error('Error updating chapter:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update chapter",
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
          <Skeleton className="h-[400px]" />
        </Card>
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[400px]">
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
          onChange={handleContentChange}
          placeholder="Start writing your chapter content..."
        />
      </Card>
    </div>
  );
};

export default ChapterEditor;