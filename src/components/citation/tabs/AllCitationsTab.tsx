import React from 'react';
import { Citation } from '@/types/thesis';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CitationList } from '../CitationList';
import { motion, AnimatePresence } from 'framer-motion';

interface AllCitationsTabProps {
  citations: Citation[];
  onRemove: (id: string) => void;
  onUpdate: (citation: Citation) => void;
  onPreview: (citation: Citation | null) => void;
}

export const AllCitationsTab = ({
  citations,
  onRemove,
  onUpdate,
  onPreview
}: AllCitationsTabProps) => {
  return (
    <ScrollArea className="h-[600px] pr-4">
      <AnimatePresence mode="wait">
        <motion.div
          key="all-citations"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2 }}
        >
          <CitationList
            citations={citations}
            onRemove={onRemove}
            onUpdate={onUpdate}
            onPreview={onPreview}
          />
        </motion.div>
      </AnimatePresence>
    </ScrollArea>
  );
};