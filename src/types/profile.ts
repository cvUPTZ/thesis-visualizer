export interface Profile {
  id: string;
  email: string;
  role: 'user' | 'admin';
  created_at: string;
}