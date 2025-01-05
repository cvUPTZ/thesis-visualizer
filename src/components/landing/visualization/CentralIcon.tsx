import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

export const CentralIcon = () => {
  return (
    <motion.div 
      className="central-icon"
      whileHover={{ scale: 1.1 }}
    >
      <div className="central-icon-pulse" />
      <BookOpen size={64} className="text-primary" />
    </motion.div>
  );
};