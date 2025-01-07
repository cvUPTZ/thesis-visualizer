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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Search, Clock } from 'lucide-react';

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
  } = useCitationManager(thesisId || '');

  const filteredAndSortedCitations = getFilteredAndSortedCitations(citations);
  const recentCitations = [...citations].sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ).slice(0, 5);

  console.log('CitationManager rendering with:', {
    totalCitations: citations.length,
    filteredCitations: filteredAndSortedCitations.length,
    searchTerm,
    filterType
  });

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
          handleAddCitation={handleAddCitation}
          handleSearchResult={handleSearchResult}
        />
      </motion.div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            All Citations
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Search & Filter
          </TabsTrigger>
          <TabsTrigger value="recent" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Recent
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
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
                  onRemove={onRemoveCitation}
                  onUpdate={onUpdateCitation}
                  onPreview={setSelectedCitation}
                />
              </motion.div>
            </AnimatePresence>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="search">
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
                  citations={filteredAndSortedCitations}
                  onRemove={onRemoveCitation}
                  onUpdate={onUpdateCitation}
                  onPreview={setSelectedCitation}
                />
              </motion.div>
            </AnimatePresence>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="recent">
          <ScrollArea className="h-[600px] pr-4">
            <AnimatePresence mode="wait">
              <motion.div
                key="recent-citations"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
              >
                <CitationList
                  citations={recentCitations}
                  onRemove={onRemoveCitation}
                  onUpdate={onUpdateCitation}
                  onPreview={setSelectedCitation}
                />
              </motion.div>
            </AnimatePresence>
          </ScrollArea>
        </TabsContent>
      </Tabs>

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