import { useState } from 'react';
import { Citation } from '@/types/thesis';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useCitationManager = (thesisId: string) => {
  const [citations, setCitations] = useState<Citation[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const addCitation = async (citation: Omit<Citation, 'thesis_id'>) => {
    try {
      setLoading(true);
      const now = new Date().toISOString();
      const newCitation: Citation = {
        ...citation,
        thesis_id: thesisId,
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

      setCitations(data);
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

  return {
    citations,
    loading,
    addCitation,
    fetchCitations,
    deleteCitation
  };
};