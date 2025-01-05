import type { User } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string | null;
  role: string | null;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
}

export interface AuthContextType {
  user: AuthUser | null;
  userId: string | null;
  userEmail: string | null;
  userRole: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}