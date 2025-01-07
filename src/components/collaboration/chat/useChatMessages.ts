import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Message } from './types';

export const useChatMessages = (thesisId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!thesisId) {
      console.log('No thesis ID provided, skipping message fetch');
      return;
    }

    const fetchMessages = async () => {
      try {
        console.log('Fetching messages for thesis:', thesisId);
        const { data, error } = await supabase
          .from('chat_messages')
          .select(`
            *,
            profiles (
              email
            )
          `)
          .eq('thesis_id', thesisId)
          .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching messages:', error);
          throw error;
        }

        console.log('Fetched messages:', data);
        setMessages(data || []);
      } catch (error: any) {
        console.error('Error in fetchMessages:', error);
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive",
        });
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `thesis_id=eq.${thesisId}`,
        },
        async (payload) => {
          console.log('New message received:', payload);
          const { data: messageWithProfile, error } = await supabase
            .from('chat_messages')
            .select(`
              *,
              profiles (
                email
              )
            `)
            .eq('id', payload.new.id)
            .single();

          if (error) {
            console.error('Error fetching message details:', error);
            return;
          }

          setMessages(prev => [...prev, messageWithProfile]);
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up chat subscription');
      supabase.removeChannel(channel);
    };
  }, [thesisId, toast]);

  return { messages, isLoading };
};