import { Dispatch, SetStateAction } from 'react';

export interface AuthContextType {
  userId: string | null;
  userEmail: string | null;
  userRole: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  setUserId: Dispatch<SetStateAction<string | null>>;
  setUserEmail: Dispatch<SetStateAction<string | null>>;
  setUserRole: Dispatch<SetStateAction<string | null>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
}