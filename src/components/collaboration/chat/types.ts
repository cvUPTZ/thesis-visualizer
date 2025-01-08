import { Message, ChatMessage } from '@/types/chat';

export type { Message, ChatMessage };

export interface ChatMessageListProps {
  messages: ChatMessage[];
}

export interface ChatMessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}