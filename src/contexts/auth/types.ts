import { User as SupabaseUser } from '@supabase/supabase-js';

export type User = {
  id: string;
  email?: string | null;
  role?: string | null;
};

export type AuthContextType = {
  userId: string | null;
  userEmail: string | null;
  loading: boolean;
  isLoading: boolean; // alias for loading for backward compatibility
  user: User | null;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  userRole: string | null;
};