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

  const handleSession = async (session: Session | null) => {
    console.log('🔄 Handling session:', session?.user?.email);
    
    if (!session) {
      updateState({ 
        user: null,
        session: null,
        isAuthenticated: false,
        userRole: null,
        userId: null,
        userEmail: null,
        isLoading: false,
        error: null
      });
      return;
    }

    try {
      const userRole = await authService.getUserRole(session.user.id);
      updateState({
        user: session.user,
        session,
        isAuthenticated: true,
        userRole: userRole || 'user',
        userId: session.user.id,
        userEmail: session.user.email,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('❌ Error updating auth state:', error);
      updateState({
        error: error as Error,
        isLoading: false,
        isAuthenticated: true,
        user: session.user,
        session,
        userId: session.user.id,
        userEmail: session.user.email,
        userRole: 'user'
      });
    }
  };

  useEffect(() => {
    console.log('🔄 Setting up auth context...');
    let mounted = true;

    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state changed:', event, session?.user?.email);
        if (mounted) {
          await handleSession(session);
        }
      }
    );

    // Initial session check
    authService.getSession().then(session => {
      if (mounted) {
        handleSession(session);
      }
    });

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
        userEmail: null,
        error: null
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