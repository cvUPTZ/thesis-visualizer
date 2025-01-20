import React, { useState } from 'react';
import { Reference } from '@/types/thesis';
import { ReferenceDialog } from './reference/ReferenceDialog';
import { ReferenceCard } from './reference/ReferenceCard';
import { ReferenceManagerProps } from '@/types/components';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { BookOpen } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const ReferenceManager: React.FC<ReferenceManagerProps> = ({
  items,
  onAdd,
  onRemove,
  onUpdate
}) => {
  const [selectedReference, setSelectedReference] = useState<Reference | null>(null);

  const handleReferenceClick = (reference: Reference) => {
    setSelectedReference(reference);
  };

  return (
    <Card className="p-6 space-y-6 bg-white/50 backdrop-blur-sm border-2 border-primary/10 shadow-xl rounded-xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-between items-center"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-serif font-medium text-primary">References</h3>
        </div>
        <ReferenceDialog onAddReference={onAdd} />
      </motion.div>

      <ScrollArea className="h-[600px] pr-4">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {items.map((reference, index) => (
              <motion.div
                key={reference.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
              >
                <ReferenceCard
                  reference={reference}
                  onRemove={onRemove}
                  onUpdate={onUpdate}
                  onClick={handleReferenceClick}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </ScrollArea>

      <Dialog open={!!selectedReference} onOpenChange={() => setSelectedReference(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Reference Details</DialogTitle>
          </DialogHeader>
          {selectedReference && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium text-lg">{selectedReference.title}</h4>
                <p className="text-muted-foreground">
                  {selectedReference.authors.join(', ')} ({selectedReference.year})
                </p>
                {selectedReference.journal && (
                  <p className="italic">{selectedReference.journal}</p>
                )}
                {selectedReference.doi && (
                  <p className="text-sm">DOI: {selectedReference.doi}</p>
                )}
                {selectedReference.url && (
                  <p className="text-sm">
                    <a
                      href={selectedReference.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {selectedReference.url}
                    </a>
                  </p>
                )}
                {selectedReference.volume && selectedReference.issue && (
                  <p className="text-sm">
                    Volume: {selectedReference.volume}, Issue: {selectedReference.issue}
                  </p>
                )}
                {selectedReference.pages && (
                  <p className="text-sm">Pages: {selectedReference.pages}</p>
                )}
                {selectedReference.publisher && (
                  <p className="text-sm">Publisher: {selectedReference.publisher}</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};