import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Chapter } from '@/types/thesis';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Json } from '@/integrations/supabase/types';

export const ChaptersList = () => {
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const { toast } = useToast();

  const handleChapterClick = (chapterId: string) => {
    setExpandedChapterId(expandedChapterId === chapterId ? null : chapterId);
  };

  const handleContentChange = async (chapterId: string, content: string) => {
    try {
      console.log('Updating chapter content:', { chapterId, contentLength: content.length });
      
      const updatedChapters = chapters.map(ch =>
        ch.id === chapterId ? { ...ch, content } : ch
      );

      // Update local state
      setChapters(updatedChapters);

      // Convert chapters to a format that matches Supabase's JSON type
      const chaptersForDb = updatedChapters.map(ch => ({
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
      const contentForDb: Json = {
        chapters: chaptersForDb,
        metadata: {},
        frontMatter: [],
        backMatter: []
      };

      // Update in database
      const { error } = await supabase
        .from('theses')
        .update({
          content: contentForDb
        })
        .eq('id', chapters[0]?.id);

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      console.log('Chapter content updated successfully');
      
      toast({
        title: "Success",
        description: "Chapter content updated successfully",
      });
    } catch (error) {
      console.error('Error updating chapter:', error);
      toast({
        title: "Error",
        description: "Failed to update chapter content",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      {chapters.map((chapter) => (
        <Card
          key={chapter.id}
          className="p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => handleChapterClick(chapter.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">{chapter.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {chapter.sections.length} sections
                </p>
              </div>
            </div>
            {expandedChapterId === chapter.id ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </div>

          {expandedChapterId === chapter.id && (
            <div className="mt-4">
              <MarkdownEditor
                value={chapter.content}
                onChange={(value) => handleContentChange(chapter.id, value || '')}
                placeholder="Start writing your chapter content..."
              />
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};