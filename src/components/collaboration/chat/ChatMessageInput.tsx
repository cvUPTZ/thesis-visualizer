import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
    <form onSubmit={onSubmit} className="p-4 border-t flex gap-2">
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type a message..."
        disabled={isLoading}
      />
      <Button type="submit" size="icon" disabled={isLoading}>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};