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
  if (!thesis) {
    return <div>Thesis data not available</div>;
  }

  const startDate = thesis.created_at ? new Date(thesis.created_at) : null;
  const today = new Date();
  
  // Estimate end date as 6 months from start if not completed
  const estimatedEndDate = startDate ? addMonths(startDate, 6) : null;
  
  const totalDays = estimatedEndDate ? differenceInDays(estimatedEndDate, startDate) : 0;
  const daysElapsed = startDate ? differenceInDays(today, startDate) : 0;
  const daysRemaining = Math.max(0, totalDays - daysElapsed);

  // Calculate progress based on content
  const calculateProgress = () => {
    const frontMatterSections = thesis.frontMatter || [];
    const chapterSections = thesis.chapters?.flatMap(chapter => chapter.sections) || [];
    const backMatterSections = thesis.backMatter || [];
    const generalIntro = thesis.generalIntroduction ? [thesis.generalIntroduction] : [];
    const generalConc = thesis.generalConclusion ? [thesis.generalConclusion] : [];

    const allSections = [
      ...frontMatterSections,
      ...generalIntro,
      ...chapterSections,
      ...generalConc,
      ...backMatterSections
    ];
    
    const completedSections = allSections.filter(section => 
      section?.content && section.content.trim().length > 100
    ).length;
    
    return allSections.length > 0 ? Math.min(100, Math.round((completedSections / allSections.length) * 100)) : 0;
  };

  const progress = calculateProgress();
  const timeProgress = Math.min(100, Math.round((daysElapsed / totalDays) * 100));

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
            <span>{timeProgress}%</span>
          </div>
          <Progress value={timeProgress} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-4 rounded-lg bg-white/30 space-y-2"
          >
            <div className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="w-4 h-4 text-blue-500" />
              Days Remaining
            </div>
            <p className="text-sm text-muted-foreground">
              {daysRemaining} days
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="p-4 rounded-lg bg-white/30 space-y-2"
          >
            <div className="flex items-center gap-2 text-sm font-medium">
              <Target className="w-4 h-4 text-green-500" />
              Content Progress
            </div>
            <p className="text-sm text-muted-foreground">
              {progress}% Complete
            </p>
          </motion.div>
        </div>

        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Important Dates</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Start Date</span>
              <span>{startDate ? format(startDate, 'MMM d, yyyy') : 'Not available'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Estimated Completion</span>
              <span>{estimatedEndDate ? format(estimatedEndDate, 'MMM d, yyyy') : 'Not available'}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};