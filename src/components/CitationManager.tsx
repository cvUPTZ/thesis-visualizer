import React from 'react';
import { Citation } from '@/types/thesis';
import { useParams } from 'react-router-dom';
import { useCitationManager } from '@/hooks/useCitationManager';
import { CitationHeader } from './citation/CitationHeader';
import { CitationFilters } from './citation/CitationFilters';
import { CitationList } from './citation/CitationList';
import { CitationPreview } from './citation/CitationPreview';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea } from './ui/scroll-area';
import { Card } from './ui/card';

interface CitationManagerProps {
  citations: Citation[];
  onAddCitation: (citation: Citation) => void;
  onRemoveCitation: (id: string) => void;
  onUpdateCitation: (citation: Citation) => void;
}

export const CitationManager = ({
  citations,
  onAddCitation,
  onRemoveCitation,
  onUpdateCitation
}: CitationManagerProps) => {
  const { thesisId } = useParams<{ thesisId: string }>();
  const {
    selectedCitation,
    setSelectedCitation,
    searchDialogOpen,
    setSearchDialogOpen,
    searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    handleAddCitation,
    handleSearchResult,
    getFilteredAndSortedCitations
  } = useCitationManager(thesisId);

  const filteredAndSortedCitations = getFilteredAndSortedCitations(citations);

  return (
    <Card className="p-6 space-y-6 bg-white/50 backdrop-blur-sm border-2 border-primary/10 shadow-xl rounded-xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <CitationHeader
          citations={citations}
          onAddCitation={onAddCitation}
          searchDialogOpen={searchDialogOpen}
          setSearchDialogOpen={setSearchDialogOpen}
          handleAddCitation={() => handleAddCitation(onAddCitation)}
          handleSearchResult={(citation) => handleSearchResult(citation, onAddCitation)}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <CitationFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filterType={filterType}
          onFilterChange={setFilterType}
          sortField={sortField}
          onSortFieldChange={setSortField}
          sortDirection={sortDirection}
          onSortDirectionChange={setSortDirection}
        />
      </motion.div>

      <ScrollArea className="h-[600px] pr-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={searchTerm + filterType + sortField + sortDirection}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            <CitationList
              citations={filteredAndSortedCitations}
              onRemove={onRemoveCitation}
              onUpdate={onUpdateCitation}
              onPreview={setSelectedCitation}
            />
          </motion.div>
        </AnimatePresence>
      </ScrollArea>

      <Dialog open={!!selectedCitation} onOpenChange={() => setSelectedCitation(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Citation Preview</DialogTitle>
          </DialogHeader>
          <AnimatePresence mode="wait">
            {selectedCitation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <CitationPreview citation={selectedCitation} />
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </Card>
  );
};