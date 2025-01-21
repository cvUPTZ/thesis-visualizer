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
    const frontMatterSections = thesis.frontMatter || [];
    const chapterSections = thesis.chapters?.flatMap(chapter => chapter.sections) || [];
    const backMatterSections = thesis.backMatter || [];

    const allSections = [
      ...frontMatterSections,
      ...chapterSections,
      ...backMatterSections
    ];
    
    const completedSections = allSections.filter(section => 
      section?.content && section.content.trim().length > 100
    ).length;
    
    return allSections.length > 0 ? Math.round((completedSections / allSections.length) * 100) : 0;
  };

  // Calculate chapter completion status
  const getChapterStatus = (chapterIndex: number) => {
    const chapter = thesis.chapters?.[chapterIndex];
    if (!chapter) return { complete: false, progress: 0 };

    const sections = chapter.sections || [];
    const completedSections = sections.filter(
      section => section?.content && section.content.trim().length > 100
    ).length;

    const progress = sections.length > 0 ? Math.round((completedSections / sections.length) * 100) : 0;
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
  const chapters = thesis.chapters || [];
  const completedChapters = chapters.filter(chapter => 
    chapter.sections?.every(section => section?.content?.length > 100)
  ).length;

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

        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-4 rounded-lg bg-white/30 space-y-2"
          >
            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock className="w-4 h-4 text-blue-500" />
              Last Updated
            </div>
            <p className="text-sm text-muted-foreground">
              {getLastUpdateDate()}
            </p>
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
              {completedChapters} / {chapters.length}
            </p>
          </motion.div>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Chapter Status</h4>
          <div className="space-y-2">
            {chapters.map((chapter, index) => {
              const status = getChapterStatus(index);
              return (
                <div key={chapter.id} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{chapter.title || `Chapter ${index + 1}`}</span>
                    <span>{status.progress}%</span>
                  </div>
                  <Progress value={status.progress} className="h-1.5" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
};