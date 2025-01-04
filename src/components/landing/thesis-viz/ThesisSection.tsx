import React from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Square } from 'lucide-react';

interface ThesisSectionProps {
  section: {
    id: number;
    title: string;
    complete: boolean;
    progress: number;
  };
  angle: number;
  radius: number;
  hoveredSection: number | null;
  onHover: (id: number | null) => void;
}

export const ThesisSection = ({ section, angle, radius, hoveredSection, onHover }: ThesisSectionProps) => {
  // Adjust radius to ensure elements stay within circle
  const adjustedRadius = radius * 0.8; // Reduce radius by 20% to keep elements inside
  const x = Math.cos((angle * Math.PI) / 180) * adjustedRadius;
  const y = Math.sin((angle * Math.PI) / 180) * adjustedRadius;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="absolute left-1/2 top-1/2"
      style={{
        transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`,
        zIndex: hoveredSection === section.id ? 10 : 1,
      }}
      onHoverStart={() => onHover(section.id)}
      onHoverEnd={() => onHover(null)}
    >
      <motion.div
        whileHover={{ scale: 1.1 }}
        className={`bg-white p-4 rounded-lg shadow-lg w-40 transition-colors ${
          hoveredSection === section.id ? 'bg-primary/5' : ''
        }`}
      >
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            {section.complete ? (
              <CheckSquare className="text-green-500" size={16} />
            ) : (
              <Square className="text-gray-400" size={16} />
            )}
            <span className="text-sm font-medium">{section.title}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${section.progress}%` }}
              transition={{ duration: 1 }}
              className="bg-primary rounded-full h-2"
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};