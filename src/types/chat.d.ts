export interface ChatMessage {
  id: string;
  content: string;
  sender_id: string;
  thesis_id: string;
  created_at: string;
}

export interface ChatMessageListProps {
  messages: ChatMessage[];
}

export interface ChatMessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}