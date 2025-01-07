import React from 'react';
import { Citation } from '@/types/thesis';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CitationList } from '../CitationList';
import { CitationFilters } from '../CitationFilters';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchCitationsTabProps {
  citations: Citation[];
  searchTerm: string;
  filterType: string;
  sortField: 'year' | 'author' | 'title';
  sortDirection: 'asc' | 'desc';
  onSearchChange: (value: string) => void;
  onFilterChange: (value: string) => void;
  onSortFieldChange: (field: 'year' | 'author' | 'title') => void;
  onSortDirectionChange: (direction: 'asc' | 'desc') => void;
  onRemove: (id: string) => void;
  onUpdate: (citation: Citation) => void;
  onPreview: (citation: Citation | null) => void;
}

export const SearchCitationsTab = ({
  citations,
  searchTerm,
  filterType,
  sortField,
  sortDirection,
  onSearchChange,
  onFilterChange,
  onSortFieldChange,
  onSortDirectionChange,
  onRemove,
  onUpdate,
  onPreview
}: SearchCitationsTabProps) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <CitationFilters
          searchTerm={searchTerm}
          onSearchChange={onSearchChange}
          filterType={filterType}
          onFilterChange={onFilterChange}
          sortField={sortField}
          onSortFieldChange={onSortFieldChange}
          sortDirection={sortDirection}
          onSortDirectionChange={onSortDirectionChange}
        />
      </motion.div>

      <ScrollArea className="h-[500px] pr-4 mt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={searchTerm + filterType + sortField + sortDirection}
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
    </>
  );
};