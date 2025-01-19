import React from 'react';
import { Section } from '@/types/thesis';
import MDEditor from '@uiw/react-md-editor';
import { motion } from 'framer-motion';

interface AbstractSectionProps {
  abstractSection?: Section;
}

export const AbstractSection = ({ abstractSection }: AbstractSectionProps) => {
  return (
    <motion.div 
      className="thesis-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="thesis-header"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Abstract
      </motion.div>
      <motion.div 
        className="thesis-content thesis-abstract"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.h2 
          className="text-2xl font-serif mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          Abstract
        </motion.h2>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <MDEditor.Markdown 
            source={abstractSection?.content || "No Abstract Provided"}
            className="prose prose-sm max-w-none"
          />
        </motion.div>
      </motion.div>
      <motion.div 
        className="thesis-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <span>Page <span className="page-number"></span></span>
      </motion.div>
    </motion.div>
  );
};