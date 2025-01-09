import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useThesis = (thesisId: string) => {
  const [thesis, setThesis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchThesis = async () => {
      try {
        const { data, error } = await supabase
          .from('theses')
          .select('*')
          .eq('id', thesisId)
          .single();

        if (error) throw error;
        setThesis(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (thesisId) {
      fetchThesis();
    }
  }, [thesisId]);

  return { thesis, loading, error };
};