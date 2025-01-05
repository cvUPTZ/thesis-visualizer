import { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { authService } from "@/services/authService";
import { User, AuthContextType } from "@/types/auth";

const initialState: AuthContextType = {
  user: null,
  session: null,
  isLoading: true,
  isAuthenticated: false,
  userRole: null,
  error: null,
  userId: null,
  userEmail: null,
  logout: async () => {}
};

const AuthContext = createContext<AuthContextType>(initialState);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthContextType>(initialState);

  const updateState = (updates: Partial<AuthContextType>) => {
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
          isAuthenticated: false,
          session: null
        });
        return;
      }

      console.log('✅ Session found:', session.user.email);
      const userRole = await authService.getUserRole(session.user.id);
      
      updateState({
        user: session.user,
        session,
        isAuthenticated: true,
        userRole,
        userId: session.user.id,
        userEmail: session.user.email,
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

        if (event === 'SIGNED_OUT' || !session) {
          updateState({
            user: null,
            session: null,
            isAuthenticated: false,
            userRole: null,
            userId: null,
            userEmail: null,
            isLoading: false
          });
          return;
        }

        try {
          const userRole = await authService.getUserRole(session.user.id);
          updateState({
            user: session.user,
            session,
            isAuthenticated: true,
            userRole,
            userId: session.user.id,
            userEmail: session.user.email,
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
        userRole: null,
        userId: null,
        userEmail: null
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