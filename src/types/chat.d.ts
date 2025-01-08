export interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  thesis_id: string;
}

export interface ChatMessage extends Message {
  sender?: {
    id: string;
    email: string;
  };
}