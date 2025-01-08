import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message } from './types';

export const useChatMessages = (thesisId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!thesisId) return;

    // Initial fetch
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          sender:profiles(email)
        `)
        .eq('thesis_id', thesisId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      setMessages(data || []);
    };

    fetchMessages();

    // Subscribe to new messages
    const subscription = supabase
      .channel(`chat_messages:thesis_id=eq.${thesisId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public',
        table: 'chat_messages',
        filter: `thesis_id=eq.${thesisId}`
      }, (payload) => {
        console.log('Received realtime message:', payload);
        if (payload.eventType === 'INSERT') {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [thesisId]);

  return { messages };
};