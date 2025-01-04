import { useState, useMemo } from 'react';
import { Citation } from '@/types/thesis';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export const useCitationManager = (thesisId: string | undefined) => {
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortField, setSortField] = useState<'year' | 'author' | 'title'>('year');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();

  const handleAddCitation = async (onAddCitation: (citation: Citation) => void) => {
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

  const handleSearchResult = async (
    citation: Omit<Citation, 'thesis_id'>,
    onAddCitation: (citation: Citation) => void
  ) => {
    try {
      if (!thesisId) {
        throw new Error('No thesis ID provided');
      }

      const citationWithThesisId: Citation = {
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

  const getFilteredAndSortedCitations = (citations: Citation[]) => {
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
  };

  return {
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
  };
};