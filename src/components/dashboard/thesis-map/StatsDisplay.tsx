import React from 'react';
import { motion } from 'framer-motion';
import { ChartBar, ChartLine, ChartPie } from 'lucide-react';

interface StatsDisplayProps {
  stats: {
    total: number;
    inProgress: number;
    completed: number;
  };
}

export const StatsDisplay = ({ stats }: StatsDisplayProps) => {
  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-2 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg"
      >
        <ChartBar className="text-primary h-5 w-5" />
        <div>
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="text-lg font-semibold text-primary">{stats.total}</p>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-2 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg"
      >
        <ChartLine className="text-primary h-5 w-5" />
        <div>
          <p className="text-xs text-muted-foreground">In Progress</p>
          <p className="text-lg font-semibold text-primary">{stats.inProgress}</p>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex items-center gap-2 bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg"
      >
        <ChartPie className="text-primary h-5 w-5" />
        <div>
          <p className="text-xs text-muted-foreground">Completed</p>
          <p className="text-lg font-semibold text-primary">{stats.completed}</p>
        </div>
      </motion.div>
    </div>
  );
};