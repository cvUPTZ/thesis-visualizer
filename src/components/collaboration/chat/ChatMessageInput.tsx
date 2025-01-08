import React from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send } from 'lucide-react';

interface ChatMessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const ChatMessageInput: React.FC<ChatMessageInputProps> = ({
  value,
  onChange,
  onSubmit,
  isLoading
}) => {
  return (
    <form onSubmit={onSubmit} className="border-t p-4 bg-gradient-to-b from-background/50 to-background backdrop-blur-sm">
      <div className="flex gap-2">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type a message..."
          className="min-h-[80px] resize-none bg-background/80 backdrop-blur-sm"
        />
        <Button 
          type="submit" 
          disabled={isLoading}
          size="icon"
          className="h-[80px] w-[80px] bg-primary hover:bg-primary/90 transition-all duration-200"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};