import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Chapter } from '@/types/thesis';
import { BookOpen, ChevronRight } from 'lucide-react';

export const ChaptersList = () => {
  const navigate = useNavigate();
  const [chapters] = React.useState<Chapter[]>([]); // This will be replaced with actual data fetching

  return (
    <div className="space-y-4">
      {chapters.map((chapter) => (
        <Card
          key={chapter.id}
          className="p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => navigate(`/chapter/${chapter.id}`)}
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
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        </Card>
      ))}
    </div>
  );
};