import React, { useRef } from 'react';
import { ChatMessageList } from './ChatMessageList';
import { ChatMessageInput } from './ChatMessageInput';
import { useChatMessages } from './useChatMessages';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ChatMessagesProps {
  thesisId: string;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ thesisId }) => {
  const [newMessage, setNewMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const { messages } = useChatMessages(thesisId);

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
    <div className="fixed bottom-4 right-4 w-[400px] h-[500px] bg-background border rounded-lg shadow-lg z-50 flex flex-col animate-slide-in-right">
      <div className="p-3 border-b bg-primary/5 rounded-t-lg">
        <h3 className="font-semibold">Chat</h3>
      </div>
      
      <ChatMessageList messages={messages} />

      <ChatMessageInput
        value={newMessage}
        onChange={setNewMessage}
        onSubmit={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
};