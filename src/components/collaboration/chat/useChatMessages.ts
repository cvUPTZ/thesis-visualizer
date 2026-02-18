import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message } from './types';
import { useToast } from '@/hooks/use-toast';

export const useChatMessages = (thesisId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!thesisId) return;

    const fetchMessages = async (retry = 0) => {
      try {
        const { data, error } = await (supabase.from('chat_messages' as any) as any)
          .select(`*, sender:profiles(email)`)
          .eq('thesis_id', thesisId)
          .order('created_at', { ascending: true });

        if (error) throw error;

        setMessages((data || []) as Message[]);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching messages:', err);
        setError(err);
        if (retry < 3) {
          setTimeout(() => fetchMessages(retry + 1), 1000 * (retry + 1));
        }
      }
    };

    fetchMessages();

    const subscription = supabase
      .channel(`chat_messages:thesis_id=eq.${thesisId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public',
        table: 'chat_messages',
        filter: `thesis_id=eq.${thesisId}`
      }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [thesisId, toast]);

  return { messages, error };
};
