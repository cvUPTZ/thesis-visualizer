export interface Notification {
  id: string;
  message: string;
  created_at: string;
  read: boolean;
  user_id: string;
  thesis_id: string;
  type: string;
}