import React from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Square } from 'lucide-react';

interface SectionNodeProps {
  id: string;
  title: string;
  progress: number;
  complete: boolean;
  position: { x: number; y: number };
  hoveredSection: string | null;
  onHover: (id: string | null) => void;
}

export const SectionNode = ({
  id,
  title,
  progress,
  complete,
  position,
  hoveredSection,
  onHover
}: SectionNodeProps) => {
  return (
    <motion.div
      key={id}
      className="absolute top-1/2 left-1/2"
      style={{
        x: position.x,
        y: position.y,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <motion.div
        className={`bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg -translate-x-1/2 -translate-y-1/2 w-48 border border-primary/10
                   ${hoveredSection === id ? 'ring-2 ring-primary/20' : ''}`}
        whileHover={{ scale: 1.05, y: -5 }}
        onHoverStart={() => onHover(id)}
        onHoverEnd={() => onHover(null)}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            {complete ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
              >
                <CheckSquare className="text-green-500" />
              </motion.div>
            ) : (
              <Square className="text-muted-foreground" />
            )}
            <span className="text-sm font-medium text-primary">{title}</span>
          </div>
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>{progress}%</span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              complete 
                ? 'bg-green-500/10 text-green-500' 
                : 'bg-primary/10 text-primary'
            }`}>
              {complete ? 'Completed' : 'In Progress'}
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};