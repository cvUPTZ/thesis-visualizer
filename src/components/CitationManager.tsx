import React, { useState, useMemo } from 'react';
import { Citation } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { CitationCard } from './citation/CitationCard';
import { CitationPreview } from './citation/CitationPreview';
import { CitationSearch } from './citation/CitationSearch';
import { CitationFilters } from './citation/CitationFilters';
import { CitationStats } from './citation/CitationStats';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useParams } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortField, setSortField] = useState<'year' | 'author' | 'title'>('year');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();
  const { thesisId } = useParams<{ thesisId: string }>();

  const handleAddCitation = async () => {
    try {
      if (!thesisId) {
        throw new Error('No thesis ID provided');
      }

      const newCitation: Citation = {
        id: crypto.randomUUID(),
        text: '',
        source: '',
        authors: [''],
        year: '',
        type: 'article',
        doi: '',
        url: '',
        journal: '',
        volume: '',
        issue: '',
        pages: '',
        publisher: '',
        thesis_id: thesisId
      };

      const { error } = await supabase
        .from('citations')
        .insert([newCitation]);

      if (error) throw error;

      onAddCitation(newCitation);
      toast({
        title: "Success",
        description: "Citation added successfully",
      });
    } catch (error: any) {
      console.error('Error adding citation:', error);
      toast({
        title: "Error",
        description: "Failed to add citation: " + error.message,
        variant: "destructive",
      });
    }
  };

  const handleSearchResult = async (citation: Citation) => {
    try {
      if (!thesisId) {
        throw new Error('No thesis ID provided');
      }

      const citationWithThesisId = {
        ...citation,
        thesis_id: thesisId
      };

      const { error } = await supabase
        .from('citations')
        .insert([citationWithThesisId]);

      if (error) throw error;

      onAddCitation(citationWithThesisId);
      setSearchDialogOpen(false);
      toast({
        title: "Success",
        description: "Citation added successfully",
      });
    } catch (error: any) {
      console.error('Error adding citation from search:', error);
      toast({
        title: "Error",
        description: "Failed to add citation: " + error.message,
        variant: "destructive",
      });
    }
  };

  const filteredAndSortedCitations = useMemo(() => {
    console.log('Filtering and sorting citations:', {
      total: citations.length,
      filterType,
      sortField,
      sortDirection
    });

    let filtered = citations;

    if (filterType !== 'all') {
      filtered = filtered.filter(citation => citation.type === filterType);
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(citation => 
        citation.text.toLowerCase().includes(searchLower) ||
        citation.authors.some(author => author.toLowerCase().includes(searchLower)) ||
        citation.journal?.toLowerCase().includes(searchLower) ||
        citation.year.includes(searchTerm)
      );
    }

    return filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortField) {
        case 'year':
          comparison = (b.year || '').localeCompare(a.year || '');
          break;
        case 'author':
          comparison = (a.authors[0] || '').localeCompare(b.authors[0] || '');
          break;
        case 'title':
          comparison = a.text.localeCompare(b.text);
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [citations, filterType, searchTerm, sortField, sortDirection]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <CitationStats citations={citations} />
        <div className="flex gap-2">
          <Dialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Search Citations
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Search Citations</DialogTitle>
              </DialogHeader>
              <CitationSearch onSelect={handleSearchResult} />
            </DialogContent>
          </Dialog>
          <Button onClick={handleAddCitation} variant="outline" size="sm" className="gap-2">
            <PlusCircle className="w-4 h-4" />
            Add Citation
          </Button>
        </div>
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAndSortedCitations.map((citation) => (
          <CitationCard
            key={citation.id}
            citation={citation}
            onRemove={onRemoveCitation}
            onUpdate={onUpdateCitation}
            onPreview={() => setSelectedCitation(citation)}
          />
        ))}
        {filteredAndSortedCitations.length === 0 && (
          <div className="col-span-2 text-center py-8 text-muted-foreground">
            No citations found. Try adjusting your filters or add a new citation.
          </div>
        )}
      </div>

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