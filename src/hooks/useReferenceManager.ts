// src/hooks/useReferenceManager.ts
import { useState } from 'react';
import { Reference } from '@/types/thesis';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

export const useReferenceManager = (thesisId: string) => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | Reference['type']>('all');
  const [sortField, setSortField] = useState<'year' | 'author' | 'title'>('year');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const { toast } = useToast();

   const {
        data: references,
        isLoading,
        error,
        refetch
    } = useQuery({
        queryKey: ['references', thesisId],
      queryFn: async () => {
          if(!thesisId){
            throw new Error('Thesis ID is required to load references');
          }

          const { data, error } = await supabase
            .from('references')
              .select('*')
              .eq('thesis_id', thesisId)
          .order('created_at', { ascending: false });

          if (error) {
            console.error('Error fetching references:', error);
            throw error;
          }
            return data as Reference[];
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    });

    const addReference = async (reference: Reference) => {
        try {
            setLoading(true);
            const now = new Date().toISOString();
        const newReference = {
          ...reference,
            thesis_id: thesisId,
            created_at: now,
              updated_at: now
        };

        const { error } = await supabase
            .from('references')
              .insert([newReference])

        if (error) throw error;
            toast({
                title: "Success",
                description: "Reference added successfully",
                });

            await refetch();

    } catch (error) {
      console.error('Error adding reference:', error);
        toast({
              title: "Error",
            description: "Failed to add reference",
              variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    const deleteReference = async (id: string) => {
      try {
        setLoading(true);
        const { error } = await supabase
          .from('references')
          .delete()
          .eq('id', id);

        if (error) throw error;
          toast({
            title: "Success",
              description: "Reference deleted successfully",
          });
          await refetch();
      } catch (error) {
        console.error('Error deleting reference:', error);
        toast({
            title: "Error",
            description: "Failed to delete reference",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
  
    const getFilteredAndSortedReferences = () => {
        if(!references) return [];
        let filtered = [...references];
        
    if (searchTerm) {
      filtered = filtered.filter(reference => 
        reference.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reference.authors.some(author => 
          author.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }

        if (filterType !== 'all') {
          filtered = filtered.filter(reference => reference.type === filterType);
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
          case 'title':
            comparison = a.title.localeCompare(b.title);
            break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  };

  return {
    references: references || [],
      isLoading,
      error,
      searchTerm,
    setSearchTerm,
    filterType,
    setFilterType,
    sortField,
    setSortField,
    sortDirection,
      setSortDirection,
      addReference,
      deleteReference,
    getFilteredAndSortedReferences,
      refetch
  };
};