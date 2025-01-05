import { User as SupabaseUser } from '@supabase/supabase-js';

export type User = {
  id: string;
  email?: string | null;
  role?: string;
};

export type SignInResponse = {
  user: User;
  userRole: string;
};

export type AuthContextType = {
  userId: string | null;
  userEmail: string | null;
  userRole: string | null;
  loading: boolean;
  isLoading: boolean;
  error: Error | null;
  signInError: Error | null;
  isAuthenticated: boolean;
  user: User | null;
  logout: () => Promise<void>;
  signOut: () => Promise<void>;
  setUserId: (id: string | null) => void;
  setUserEmail: (email: string | null) => void;
  setUserRole: (role: string | null) => void;
  setLoading: (loading: boolean) => void;
};