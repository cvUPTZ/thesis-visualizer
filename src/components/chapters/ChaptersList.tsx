import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Chapter } from '@/types/thesis';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { MarkdownEditor } from '@/components/MarkdownEditor';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const ChaptersList = () => {
  const [expandedChapterId, setExpandedChapterId] = useState<string | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const { toast } = useToast();

  const handleChapterClick = (chapterId: string) => {
    setExpandedChapterId(expandedChapterId === chapterId ? null : chapterId);
  };

  const handleContentChange = async (chapterId: string, content: string) => {
    try {
      const updatedChapters = chapters.map(ch =>
        ch.id === chapterId ? { ...ch, content } : ch
      );

      // Update local state
      setChapters(updatedChapters);

      // Update in database
      const { error } = await supabase
        .from('theses')
        .update({
          content: { chapters: updatedChapters }
        })
        .eq('id', chapters[0]?.id);

      if (error) throw error;

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