import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Thesis } from '@/types/thesis';
import { useToast } from './use-toast';
import { debounce } from 'lodash';

export const useThesisRealtime = (
  thesisId: string | undefined,
  setThesis: React.Dispatch<React.SetStateAction<Thesis | null>>
) => {
  const { toast } = useToast();
  const thesisRef = useRef<Thesis | null>(null);
  const lastUpdateTime = useRef<string>('');

  const showUpdateNotification = debounce(() => {
    toast({ 
      title: "Changes Detected", 
      description: "New updates from collaborators" 
    });
  }, 3000);

  useEffect(() => {
    if (!thesisId) return;

    const channel = supabase
      .channel('thesis-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'theses',
          filter: `id=eq.${thesisId}`
        },
        (payload) => {
          try {
            const newThesis = payload.new as Thesis;
            const currentThesis = thesisRef.current;

            // Skip if this is our own update or an older update
            if (!currentThesis || 
                newThesis.updated_at <= lastUpdateTime.current ||
                newThesis.user_id === currentThesis.user_id) {
              return;
            }

            lastUpdateTime.current = newThesis.updated_at;
            setThesis(prev => prev ? {
              ...prev,
              ...newThesis,
              content: {
                ...prev.content,
                ...newThesis.content
              }
            } : prev);
            
            showUpdateNotification();
          } catch (error) {
            console.error('Realtime update error:', error);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
      showUpdateNotification.cancel();
    };
  }, [thesisId, toast, setThesis]);

  // Sync ref with latest thesis value
  const updateRef = (thesis: Thesis | null) => {
    thesisRef.current = thesis;
    lastUpdateTime.current = thesis?.updated_at || '';
    return thesis;
  };

  return { updateRef };
};