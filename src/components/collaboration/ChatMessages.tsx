import React, { useState } from 'react';
import { ChatMessageList } from './chat/ChatMessageList';
import { ChatMessageInput } from './chat/ChatMessageInput';
import { useChatMessages } from './chat/useChatMessages';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useTheme } from '../ThemeProvider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { Button } from '../ui/button';
import { ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface ChatMessagesProps {
  thesisId: string;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ thesisId }) => {
  const [newMessage, setNewMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [showChat, setShowChat] = useState(true);
  const { toast } = useToast();
  const { messages, error } = useChatMessages(thesisId);
  const { theme } = useTheme();

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
      const { error } = await (supabase.from('chat_messages' as any) as any)
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
        description: "Failed to send message. Please try again.",
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
    <Collapsible
      open={showChat}
      onOpenChange={setShowChat}
      className="fixed bottom-4 right-4 w-[400px] z-50"
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="absolute -top-10 right-0 bg-background shadow-md"
        >
          {showChat ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronUp className="h-4 w-4" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className={`
          w-full h-[500px] 
          border rounded-lg shadow-lg
          flex flex-col overflow-hidden
          backdrop-blur-sm
          ${theme === 'dark' 
            ? 'bg-dark-bg/95 border-dark-border shadow-2xl' 
            : 'bg-background/95 border-border'
          }
        `}>
          <div className={`
            p-3 border-b backdrop-blur-sm
            ${theme === 'dark' 
              ? 'bg-dark-card/90 border-dark-border' 
              : 'bg-editor-bg-accent/90 border-editor-border'
            }
          `}>
            <h3 className="font-semibold">Chat</h3>
          </div>
          
          {error ? (
            <Alert variant="destructive" className="m-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to load messages. Please check your connection.
              </AlertDescription>
            </Alert>
          ) : (
            <ChatMessageList messages={messages} />
          )}

          <ChatMessageInput
            value={newMessage}
            onChange={setNewMessage}
            onSubmit={handleSendMessage}
            isLoading={isLoading}
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};