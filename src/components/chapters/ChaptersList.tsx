import React from 'react';
import { Chapter } from '@/types/thesis';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

interface ChaptersListProps {
  chapters: Chapter[];
}

export const ChaptersList: React.FC<ChaptersListProps> = ({ chapters }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {chapters.map((chapter) => (
        <Card
          key={chapter.id}
          className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => navigate(`/chapters/${chapter.id}`)}
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            <h3 className="font-medium">{chapter.title}</h3>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {chapter.sections.length} sections
          </p>
        </Card>
      ))}
    </div>
  );
};