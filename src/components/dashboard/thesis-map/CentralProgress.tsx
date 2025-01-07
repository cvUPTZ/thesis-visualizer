import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

interface CentralProgressProps {
  totalProgress: number;
}

export const CentralProgress = ({ totalProgress }: CentralProgressProps) => {
  return (
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <motion.div
        className="relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute -inset-32 border-2 border-dashed border-primary/20 rounded-full" />
      </motion.div>
      
      <motion.div
        className="relative z-10 bg-white p-8 rounded-full shadow-xl"
        whileHover={{ scale: 1.1 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 1 }}
      >
        <motion.div
          className="absolute inset-0 bg-primary/5 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.2, 0.5],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <BookOpen size={48} className="text-primary relative z-10" />
      </motion.div>

      <div className="absolute -bottom-24 left-1/2 transform -translate-x-1/2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center"
        >
          <div className="relative w-16 h-16">
            <Progress
              value={totalProgress}
              className="h-16 w-16 [&>div]:h-16 [&>div]:w-16 rotate-[-90deg]"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Clock className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-2 text-center">
            <p className="font-medium text-sm text-primary">{totalProgress}% Complete</p>
            <p className="text-xs text-muted-foreground">Overall Progress</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};