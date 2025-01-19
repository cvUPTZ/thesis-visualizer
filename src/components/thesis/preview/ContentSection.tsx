import React from 'react';
import { Section } from '@/types/thesis';
import MDEditor from '@uiw/react-md-editor';
import { cn } from '@/lib/utils';
import { ContentElements } from './ContentElements';
import { motion } from 'framer-motion';

interface ContentSectionProps {
  section: Section;
  chapterTitle?: string;
  elementPositions: Array<{
    id: string;
    type: 'figure' | 'table' | 'citation';
    position: 'inline' | 'top' | 'bottom' | 'custom';
    customPosition?: {
      x: number;
      y: number;
    };
  }>;
  onElementClick: (id: string, type: 'figure' | 'table' | 'citation') => void;
  onPositionChange: (elementId: string, position: { x: number; y: number }) => void;
}

export const ContentSection = ({ 
  section, 
  chapterTitle, 
  elementPositions,
  onElementClick,
  onPositionChange 
}: ContentSectionProps) => {
  const isSpecialSection = section.type === 'references' || section.type === 'table-of-contents';
  const sectionTypeClasses = {
    'general-introduction': 'thesis-introduction',
    'literature-review': 'thesis-literature',
    'methodology': 'thesis-methodology',
    'results': 'thesis-results',
    'discussion': 'thesis-discussion',
    'conclusion': 'thesis-conclusion'
  };

  return (
    <motion.div 
      className="thesis-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="thesis-header"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {chapterTitle ? `Chapter ${chapterTitle} - ${section.title}` : section.title}
      </motion.div>
      
      <motion.div 
        className={cn(
          "thesis-content",
          section.type === 'references' && "thesis-references",
          sectionTypeClasses[section.type as keyof typeof sectionTypeClasses],
          "prose prose-sm max-w-none"
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {section.type !== 'table-of-contents' && (
          <>
            {chapterTitle && (
              <motion.h2 
                className="text-2xl font-serif mb-4 break-after-avoid"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                {section.title}
              </motion.h2>
            )}
            <motion.div 
              className="break-inside-avoid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <MDEditor.Markdown source={section.content} />
            </motion.div>
            
            <ContentElements
              figures={section.figures}
              tables={section.tables}
              citations={section.citations}
              elementPositions={elementPositions}
              onElementClick={onElementClick}
              onPositionChange={onPositionChange}
            />
          </>
        )}

        {section.type === 'table-of-contents' && (
          <motion.div 
            className="toc-content break-inside-avoid"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-serif mb-4">Table of Contents</h2>
          </motion.div>
        )}
      </motion.div>

      {section.footnotes && section.footnotes.length > 0 && (
        <motion.div 
          className="thesis-footnotes"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {section.footnotes.map((footnote) => (
            <motion.div 
              key={footnote.id} 
              className="thesis-footnote"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              {footnote.content}
            </motion.div>
          ))}
        </motion.div>
      )}

      <motion.div 
        className="thesis-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        {!isSpecialSection && <span>Page <span className="page-number"></span></span>}
      </motion.div>
    </motion.div>
  );
};