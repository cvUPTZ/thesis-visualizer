export interface AuthContextType {
  userId: string | null;
  loading: boolean;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  userRole: string | null;
   setLoading: (loading: boolean) => void;
}