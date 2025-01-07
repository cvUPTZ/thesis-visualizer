import { useState } from 'react';
import { Citation } from '@/types/thesis';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useCitationManager = (thesisId: string) => {
  const [citations, setCitations] = useState<Citation[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortField, setSortField] = useState<'year' | 'author' | 'title'>('year');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();

  const addCitation = async (citation: Omit<Citation, 'thesis_id'>) => {
    try {
      setLoading(true);
      const now = new Date().toISOString();
      const newCitation: Citation = {
        ...citation,
        thesis_id: thesisId,
        type: citation.type || 'article',
        created_at: now,
        updated_at: now
      };

      const { data, error } = await supabase
        .from('citations')
        .insert([newCitation])
        .select()
        .single();

      if (error) throw error;

      setCitations(prev => [...prev, data]);
      toast({
        title: "Success",
        description: "Citation added successfully",
      });
    } catch (error) {
      console.error('Error adding citation:', error);
      toast({
        title: "Error",
        description: "Failed to add citation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCitations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('citations')
        .select('*')
        .eq('thesis_id', thesisId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setCitations(data as Citation[]);
    } catch (error) {
      console.error('Error fetching citations:', error);
      toast({
        title: "Error",
        description: "Failed to fetch citations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteCitation = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('citations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCitations(prev => prev.filter(citation => citation.id !== id));
      toast({
        title: "Success",
        description: "Citation deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting citation:', error);
      toast({
        title: "Error",
        description: "Failed to delete citation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCitation = () => {
    setSearchDialogOpen(true);
  };

  const handleSearchResult = (citation: Omit<Citation, 'thesis_id'>) => {
    addCitation(citation);
    setSearchDialogOpen(false);
  };

  const getFilteredAndSortedCitations = (citationsToFilter: Citation[]) => {
    let filtered = [...citationsToFilter];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(citation => 
        citation.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        citation.authors.some(author => 
          author.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(citation => citation.type === filterType);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'year':
          comparison = a.year.localeCompare(b.year);
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

    return filtered;
  };

  return {
    citations,
    loading,
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
    addCitation,
    fetchCitations,
    deleteCitation,
    handleAddCitation,
    handleSearchResult,
    getFilteredAndSortedCitations
  };
};