import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, Target, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Thesis } from '@/types/thesis';
import { format, differenceInDays, addMonths } from 'date-fns';

interface ThesisPlanningProps {
  thesis: Thesis;
}

export const ThesisPlanning: React.FC<ThesisPlanningProps> = ({ thesis }) => {
  const startDate = new Date(thesis.created_at);
  const today = new Date();
  
  // Estimate end date as 6 months from start if not completed
  const estimatedEndDate = addMonths(startDate, 6);
  
  const totalDays = differenceInDays(estimatedEndDate, startDate);
  const daysElapsed = differenceInDays(today, startDate);
  const daysRemaining = Math.max(0, totalDays - daysElapsed);
  
  // Calculate progress based on content
  const calculateProgress = () => {
    const allSections = [
      ...thesis.frontMatter,
      ...thesis.chapters.flatMap(chapter => chapter.sections),
      ...thesis.backMatter
    ];
    
    const completedSections = allSections.filter(section => 
      section.content && section.content.trim().length > 100
    ).length;
    
    return Math.min(100, Math.round((completedSections / allSections.length) * 100));
  };

  const progress = calculateProgress();

  return (
    <Card className="p-6 space-y-6 bg-white/50 backdrop-blur-sm border-2 border-primary/10 shadow-xl rounded-xl">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Thesis Timeline
        </h3>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Timeline Progress</span>
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
              <Calendar className="w-4 h-4 text-primary" />
              Start Date
            </div>
            <p className="text-sm text-muted-foreground">
              {format(startDate, 'PPP')}
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-4 rounded-lg bg-white/30 space-y-2"
          >
            <div className="flex items-center gap-2 text-sm font-medium">
              <Target className="w-4 h-4 text-primary" />
              Target Completion
            </div>
            <p className="text-sm text-muted-foreground">
              {format(estimatedEndDate, 'PPP')}
            </p>
          </motion.div>
        </div>

        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Time Remaining</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {daysRemaining} days
            </span>
          </div>

          {daysRemaining < 30 && progress < 90 && (
            <div className="flex items-center gap-2 text-yellow-600 bg-yellow-50 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">Less than a month remaining with {progress}% completion!</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};