import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ChatHeader } from './chat/ChatHeader';
import { ChatMessageList } from './chat/ChatMessageList';
import { ChatInput } from './chat/ChatInput';
import { Message } from './chat/types';

interface ChatMessagesProps {
  thesisId: string;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ thesisId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();
  const processedMessageIds = React.useRef(new Set<string>());

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
      data?.forEach(message => processedMessageIds.current.add(message.id));
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

  useEffect(() => {
    if (!thesisId) {
      console.log('No thesis ID provided, skipping message fetch');
      return;
    }

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
          
          // Check if we've already processed this message
          if (processedMessageIds.current.has(payload.new.id)) {
            console.log('Message already processed, skipping:', payload.new.id);
            return;
          }

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

          processedMessageIds.current.add(messageWithProfile.id);
          setMessages(prev => [...prev, messageWithProfile]);
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up chat subscription');
      supabase.removeChannel(channel);
    };
  }, [thesisId, toast]);

  if (!thesisId) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 w-[400px] h-[500px] bg-background border rounded-lg shadow-lg z-50 flex flex-col animate-slide-in-right">
      <ChatHeader />
      <ChatMessageList messages={messages} />
      <ChatInput thesisId={thesisId} onMessageSent={fetchMessages} />
    </div>
  );
};