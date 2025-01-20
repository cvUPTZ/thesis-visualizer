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

    let retryCount = 0;
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second

    const fetchMessages = async (retry = 0) => {
      try {
        console.log('Fetching chat messages for thesis:', thesisId, 'attempt:', retry + 1);
        
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
          throw error;
        }

        console.log('Successfully fetched messages:', data?.length || 0);
        setMessages(data || []);
        setError(null);
      } catch (err: any) {
        console.error('Error in fetchMessages:', err);
        setError(err);

        // Retry logic
        if (retry < maxRetries) {
          console.log(`Retrying in ${retryDelay}ms... (${retry + 1}/${maxRetries})`);
          setTimeout(() => fetchMessages(retry + 1), retryDelay * (retry + 1));
        } else {
          toast({
            title: "Error loading messages",
            description: "Please check your connection and try again",
            variant: "destructive",
          });
        }
      }
    };

    // Initial fetch
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
      .subscribe((status) => {
        console.log('Subscription status:', status);
        
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to chat messages');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Error subscribing to chat messages');
          toast({
            title: "Connection Error",
            description: "Failed to connect to chat. Messages may be delayed.",
            variant: "destructive",
          });
        }
      });

    return () => {
      console.log('Cleaning up chat subscription');
      subscription.unsubscribe();
    };
  }, [thesisId, toast]);

  return { messages, error };
};