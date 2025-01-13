import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Reference } from '@/types/thesis';

export const useReferenceManager = (thesisId: string) => {
  const fetchReferences = useCallback(async () => {
    const { data, error } = await supabase
      .from('thesis_references')
      .select('*')
      .eq('thesis_id', thesisId);

    if (error) {
      console.error('Error fetching references:', error);
      return [];
    }

    return data as Reference[];
  }, [thesisId]);

  const addReference = useCallback(async (reference: Omit<Reference, 'id'>) => {
    const { data, error } = await supabase
      .from('thesis_references')
      .insert([{ ...reference, thesis_id: thesisId }])
      .select()
      .single();

    if (error) {
      console.error('Error adding reference:', error);
      return null;
    }

    return data as Reference;
  }, [thesisId]);

  const deleteReference = useCallback(async (referenceId: string) => {
    const { error } = await supabase
      .from('thesis_references')
      .delete()
      .eq('id', referenceId);

    if (error) {
      console.error('Error deleting reference:', error);
      return false;
    }

    return true;
  }, []);

  return {
    fetchReferences,
    addReference,
    deleteReference
  };
};