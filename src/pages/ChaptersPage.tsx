import React from 'react';
import { ChapterCreationForm } from '@/components/chapters/ChapterCreationForm';
import { ChaptersList } from '@/components/chapters/ChaptersList';
import { useToast } from '@/hooks/use-toast';
import { Chapter } from '@/types/thesis';
import { useNavigate } from 'react-router-dom';

const ChaptersPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChapterCreate = (chapter: Chapter) => {
    toast({
      title: "Chapter Created",
      description: "Your new chapter has been created successfully.",
    });
    navigate(`/chapter/${chapter.id}`);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Chapters</h1>
      <ChapterCreationForm onChapterCreate={handleChapterCreate} />
      <ChaptersList />
    </div>
  );
};

export default ChaptersPage;