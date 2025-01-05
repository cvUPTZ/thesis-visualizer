import { Dispatch, SetStateAction } from 'react';

export interface User {
  id: string;
  email: string | null;
  role?: string | null;
}

export interface AuthContextType {
  user: User | null;
  userId: string | null;
  userEmail: string | null;
  userRole: string | null;
  loading: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  signOut: () => Promise<void>;
  setUserId: Dispatch<SetStateAction<string | null>>;
  setUserEmail: Dispatch<SetStateAction<string | null>>;
  setUserRole: Dispatch<SetStateAction<string | null>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
}