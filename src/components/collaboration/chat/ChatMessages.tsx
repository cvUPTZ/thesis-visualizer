import React, { useEffect, useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { ChatMessageItem } from './ChatMessageItem';
import { ChatMessageInput } from './ChatMessageInput';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  profiles?: {
    email?: string;
  };
}

interface ChatMessagesProps {
  thesisId: string;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ thesisId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
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
        scrollToBottom();
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
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up chat subscription');
      supabase.removeChannel(channel);
    };
  }, [thesisId, toast]);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !thesisId) return;

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      console.log('Sending message:', newMessage);
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          thesis_id: thesisId,
          content: newMessage.trim(),
          sender_id: user.id
        });

      if (error) {
        console.error('Error sending message:', error);
        throw error;
      }

      setNewMessage('');
    } catch (error: any) {
      console.error('Error in handleSendMessage:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!thesisId) {
    return null;
  }

  return (
    <div className="flex flex-col h-[400px] bg-background border rounded-lg shadow-sm">
      <div className="p-3 border-b">
        <h3 className="font-semibold">Chat</h3>
      </div>
      
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessageItem key={message.id} message={message} />
          ))}
        </div>
      </ScrollArea>

      <ChatMessageInput
        value={newMessage}
        onChange={setNewMessage}
        onSubmit={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
};