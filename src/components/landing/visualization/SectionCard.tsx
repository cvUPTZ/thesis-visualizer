import React from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Square } from 'lucide-react';

interface Section {
  id: number;
  title: string;
  complete: boolean;
  progress: number;
  wordCount: number;
  citations: number;
}

interface SectionCardProps {
  section: Section;
  position: { x: number; y: number };
  onHoverStart: () => void;
  onHoverEnd: () => void;
}

export const SectionCard = ({ section, position, onHoverStart, onHoverEnd }: SectionCardProps) => {
  return (
    <motion.div
      key={section.id}
      className="section-card"
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`
      }}
      whileHover={{ scale: 1.05 }}
      onHoverStart={onHoverStart}
      onHoverEnd={onHoverEnd}
    >
      <div className="section-header">
        <h3>{section.title}</h3>
        {section.complete ? (
          <CheckSquare className="text-success" />
        ) : (
          <Square className="text-secondary" />
        )}
      </div>
      <div className="progress-bar">
        <motion.div
          className="progress-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${section.progress}%` }}
        />
      </div>
      <div className="section-details">
        <span>{section.wordCount} words</span>
        <span>{section.citations} citations</span>
      </div>
    </motion.div>
  );
};