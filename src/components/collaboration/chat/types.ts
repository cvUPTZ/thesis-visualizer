export interface Message {
  id: string;
  content: string;
  sender_id: string;
  sender?: {
    email: string;
  };
  created_at: string;
}