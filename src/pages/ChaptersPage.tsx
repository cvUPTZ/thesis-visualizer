import React from 'react';
import { ChapterCreationForm } from '@/components/chapters/ChapterCreationForm';
import { ChaptersList } from '@/components/chapters/ChaptersList';
import { useToast } from '@/hooks/use-toast';
import { Chapter } from '@/types/thesis';
import { useNavigate } from 'react-router-dom';
import { ChapterSidebar } from '@/components/chapters/ChapterSidebar';

const ChaptersPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChapterCreate = (chapter: Chapter) => {
    console.log('Creating new chapter:', chapter);
    toast({
      title: "Chapter Created",
      description: "Your new chapter has been created successfully.",
    });
    navigate(`/chapter/${chapter.id}`);
  };

  return (
    <div className="flex h-screen bg-background">
      <ChapterSidebar />
      <div className="flex-1 container mx-auto p-6 space-y-8">
        <h1 className="text-3xl font-bold">Chapters</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <ChapterCreationForm onChapterCreate={handleChapterCreate} />
          </div>
          <div>
            <ChaptersList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChaptersPage;