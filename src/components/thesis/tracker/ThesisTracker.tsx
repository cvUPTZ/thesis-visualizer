import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, BookOpen, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Thesis } from '@/types/thesis';

interface ThesisTrackerProps {
  thesis: Thesis;
}

export const ThesisTracker = ({ thesis }: ThesisTrackerProps) => {
  // Calculate overall progress based on completed sections
  const calculateProgress = () => {
    const allSections = [
      ...thesis.frontMatter,
      ...thesis.chapters.flatMap(chapter => chapter.sections),
      ...thesis.backMatter
    ];
    
    const completedSections = allSections.filter(section => 
      section.content && section.content.trim().length > 100
    ).length;
    
    return Math.round((completedSections / allSections.length) * 100);
  };

  // Calculate chapter completion status
  const getChapterStatus = (chapterIndex: number) => {
    const chapter = thesis.chapters[chapterIndex];
    if (!chapter) return { complete: false, progress: 0 };

    const completedSections = chapter.sections.filter(
      section => section.content && section.content.trim().length > 100
    ).length;

    const progress = Math.round((completedSections / chapter.sections.length) * 100);
    return {
      complete: progress === 100,
      progress
    };
  };

  // Get last update date
  const getLastUpdateDate = () => {
    return new Date(thesis.updated_at).toLocaleDateString();
  };

  const progress = calculateProgress();

  return (
    <Card className="p-6 space-y-6 bg-white/50 backdrop-blur-sm border-2 border-primary/10 shadow-xl rounded-xl">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-primary" />
          Thesis Progress Tracker
        </h3>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Overall Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-4 rounded-lg bg-white/30 space-y-2"
          >
            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock className="w-4 h-4 text-primary" />
              Last Updated
            </div>
            <p className="text-sm text-muted-foreground">{getLastUpdateDate()}</p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-4 rounded-lg bg-white/30 space-y-2"
          >
            <div className="flex items-center gap-2 text-sm font-medium">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Completed Chapters
            </div>
            <p className="text-sm text-muted-foreground">
              {thesis.chapters.filter(chapter => 
                chapter.sections.every(section => section.content?.length > 100)
              ).length} / {thesis.chapters.length}
            </p>
          </motion.div>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Chapter Status</h4>
          <div className="space-y-2">
            {thesis.chapters.map((chapter, index) => {
              const status = getChapterStatus(index);
              return (
                <div key={chapter.id} className="flex items-center justify-between text-sm">
                  <span className="truncate flex-1 mr-2">{chapter.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{status.progress}%</span>
                    {status.complete ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
};