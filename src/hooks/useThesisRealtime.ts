import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Thesis } from '@/types/thesis';

export const useThesisRealtime = (thesisId: string | undefined, localThesis: Thesis | null, setLocalThesis: (thesis: Thesis | null) => void) => {
  useEffect(() => {
    if (!thesisId) return;

    const channel = supabase
      .channel(`thesis:${thesisId}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'theses', filter: `id=eq.${thesisId}` }, (payload) => {
        const updatedThesis = payload.new as Thesis;
        setLocalThesis(updatedThesis);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [thesisId, setLocalThesis]);
};
