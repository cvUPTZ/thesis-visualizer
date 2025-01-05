import { authService } from "@/services/authService";

export type { AuthUser, AuthState } from "@/services/authService";

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