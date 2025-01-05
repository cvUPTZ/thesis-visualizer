import { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { authService } from "@/services/authService";
import { User } from "@/types/auth";

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userRole: string | null;
  error: Error | null;
}

interface AuthContextType extends AuthState {
  logout: () => Promise<void>;
}

const initialState: AuthState = {
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  userRole: null,
  error: null
};

const AuthContext = createContext<AuthContextType>({
  ...initialState,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>(initialState);

  const updateState = (updates: Partial<AuthState>) => {
    setState(current => ({ ...current, ...updates }));
  };

  const initializeAuth = async () => {
    try {
      console.log('🔄 Initializing auth...');
      const session = await authService.getSession();

      if (!session) {
        console.log('ℹ️ No active session');
        updateState({ 
          isLoading: false, 
          isAuthenticated: false 
        });
        return;
      }

      console.log('✅ Session found:', session.user.email);
      const userRole = await authService.getUserRole(session.user.id);
      
      updateState({
        session,
        user: session.user,
        isAuthenticated: true,
        userRole,
        isLoading: false
      });
    } catch (error) {
      console.error('❌ Auth initialization error:', error);
      updateState({ 
        error: error as Error,
        isLoading: false,
        isAuthenticated: false 
      });
    }
  };

  useEffect(() => {
    let mounted = true;
    console.log('🔄 Setting up auth context...');

    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email);
        
        if (!mounted) return;

        if (!session) {
          updateState({
            user: null,
            session: null,
            isAuthenticated: false,
            userRole: null,
            isLoading: false
          });
          return;
        }

        try {
          const userRole = await authService.getUserRole(session.user.id);
          updateState({
            session,
            user: session.user,
            isAuthenticated: true,
            userRole,
            isLoading: false
          });
        } catch (error) {
          console.error('❌ Error updating auth state:', error);
          updateState({
            error: error as Error,
            isLoading: false
          });
        }
      }
    );

    initializeAuth();

    return () => {
      console.log('🧹 Cleaning up auth context...');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      console.log('🔄 Starting logout...');
      await authService.signOut();
      updateState({
        user: null,
        session: null,
        isAuthenticated: false,
        userRole: null
      });
    } catch (error) {
      console.error('❌ Logout error:', error);
      updateState({ error: error as Error });
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};