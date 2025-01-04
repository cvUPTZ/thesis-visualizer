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
    <div className="space-y-6">
      <CitationHeader
        citations={citations}
        onAddCitation={onAddCitation}
        searchDialogOpen={searchDialogOpen}
        setSearchDialogOpen={setSearchDialogOpen}
        handleAddCitation={() => handleAddCitation(onAddCitation)}
        handleSearchResult={(citation) => handleSearchResult(citation, onAddCitation)}
      />

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

      <CitationList
        citations={filteredAndSortedCitations}
        onRemove={onRemoveCitation}
        onUpdate={onUpdateCitation}
        onPreview={setSelectedCitation}
      />

      <Dialog open={!!selectedCitation} onOpenChange={() => setSelectedCitation(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Citation Preview</DialogTitle>
          </DialogHeader>
          {selectedCitation && (
            <CitationPreview citation={selectedCitation} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};