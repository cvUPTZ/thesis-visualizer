export interface Profile {
  id: string;
  email: string;
  created_at?: string;
  role_id?: string;
  roles?: {
    name: string;
  };
}