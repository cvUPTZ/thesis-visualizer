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
  const currentUserRef = React.useRef<string | null>(null);

  const fetchMessages = async () => {
    try {
      console.log('Fetching messages for thesis:', thesisId);
      const { data: { user } } = await supabase.auth.getUser();
      currentUserRef.current = user?.id || null;

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
          
          if (processedMessageIds.current.has(payload.new.id)) {
            console.log('Message already processed, skipping:', payload.new.id);
            return;
          }

          if (payload.new.sender_id === currentUserRef.current) {
            console.log('Own message, already in UI, skipping:', payload.new.id);
            processedMessageIds.current.add(payload.new.id);
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
    <div className="h-[500px] bg-background border rounded-lg shadow-lg flex flex-col overflow-hidden">
      <div className="bg-editor-bg-accent border-b border-editor-border">
        <ChatHeader />
      </div>
      <div className="flex-1 overflow-y-auto bg-white/50 backdrop-blur-sm">
        <ChatMessageList messages={messages} />
      </div>
      <div className="border-t border-editor-border bg-editor-bg-accent p-4">
        <ChatInput thesisId={thesisId} onMessageSent={fetchMessages} />
      </div>
    </div>
  );
};