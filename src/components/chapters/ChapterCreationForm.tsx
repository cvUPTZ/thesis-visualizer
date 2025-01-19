import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Chapter } from '@/types/thesis';
import { BookOpen } from 'lucide-react';

interface ChapterFormData {
  title: string;
}

interface ChapterCreationFormProps {
  onChapterCreate: (chapter: Chapter) => void;
}

export const ChapterCreationForm: React.FC<ChapterCreationFormProps> = ({ onChapterCreate }) => {
  const { register, handleSubmit, reset } = useForm<ChapterFormData>();

  const onSubmit = (data: ChapterFormData) => {
    const newChapter: Chapter = {
      id: Date.now().toString(),
      title: data.title,
      content: '',
      sections: [],
      part: 1,
      figures: [],
      tables: [],
      footnotes: []
    };
    onChapterCreate(newChapter);
    reset();
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Create New Chapter</h2>
        </div>
        <div className="space-y-2">
          <Input
            {...register('title', { required: true })}
            placeholder="Enter chapter title"
            className="w-full"
          />
        </div>
        <Button type="submit" className="w-full">
          Create Chapter
        </Button>
      </form>
    </Card>
  );
};