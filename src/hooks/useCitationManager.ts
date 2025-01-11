// src/hooks/useCitationManager.ts

import { useState } from 'react';
import { Citation } from '@/types/thesis';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { useQuery } from '@tanstack/react-query';

export const useCitationManager = (thesisId: string) => {
    const { toast } = useToast();
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | Citation['type']>('all');
  const [sortField, setSortField] = useState<'year' | 'author' | 'text'>('year');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    const {
        data: citations,
        isLoading,
        error,
        refetch
    } = useQuery({
      queryKey: ['citations', thesisId],
        queryFn: async () => {
          if(!thesisId){
            throw new Error('Thesis ID is required to load citations');
          }

        const { data, error } = await supabase
            .from('citations')
            .select('*')
            .eq('thesis_id', thesisId)
            .order('created_at', { ascending: false });

          if (error) {
                console.error('Error fetching citations:', error);
                throw error;
            }

            return data as Citation[];
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    });

    const addCitation = async (citation: Omit<Citation, 'thesis_id'>) => {
        try {
      const now = new Date().toISOString();
        const newCitation: Citation = {
        ...citation,
        thesis_id: thesisId,
          type: citation.type || 'article',
        created_at: now,
        updated_at: now
        };

        const { error } = await supabase
            .from('citations')
            .insert([newCitation]);

          if (error) throw error;

        toast({
          title: "Success",
          description: "Citation added successfully",
          });

            await refetch()
        } catch (error: any) {
          console.error('Error adding citation:', error);
            toast({
                title: "Error",
                description: "Failed to add citation",
                variant: "destructive",
            });
        }
    };


  const deleteCitation = async (id: string) => {
    try {
        const { error } = await supabase
        .from('citations')
        .delete()
            .eq('id', id);
            
      if (error) throw error;

        toast({
          title: "Success",
            description: "Citation deleted successfully",
        });

          await refetch();
        } catch (error) {
        console.error('Error deleting citation:', error);
          toast({
                title: "Error",
                description: "Failed to delete citation",
              variant: "destructive",
          });
    }
  };

  const handleAddCitation = () => {
    setSearchDialogOpen(true);
  };

  const handleSearchResult = (citation: Omit<Citation, 'thesis_id'>) => {
    addCitation(citation);
    setSearchDialogOpen(false);
  };

  const getFilteredAndSortedCitations = () => {
      if (!citations) return [];
    let filtered = [...citations];
    
    if (searchTerm) {
      filtered = filtered.filter(citation => 
        citation.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        citation.authors.some(author => 
          author.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(citation => citation.type === filterType);
    }

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'year':
          comparison = a.year.localeCompare(b.year);
          break;
        case 'author':
          comparison = (a.authors[0] || '').localeCompare(b.authors[0] || '');
          break;
        case 'text':
          comparison = a.text.localeCompare(b.text);
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  };

  return {
    citations: citations || [],
    isLoading,
    error,
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
    deleteCitation,
    handleAddCitation,
    handleSearchResult,
      getFilteredAndSortedCitations,
      refetch
  };
};