import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AuthContextType } from "./auth/types";

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  userRole: 'user',
  isLoading: true,
  error: null,
  isAuthenticated: false,
  userId: null,
  userEmail: null,
  loading: true,
  signIn: async () => ({ user: { id: '', email: null }, userRole: 'user' }),
  signOut: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string>('user');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔄 Setting up auth...');
    let mounted = true;

    const setupAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('📍 Initial session:', session?.user?.email);
        
        if (mounted) {
          setSession(session);
          if (session?.user) {
            setUserId(session.user.id);
            setUserEmail(session.user.email);
            await fetchUserRole(session.user.id);
          }
        }
      } catch (error) {
        console.error('❌ Error in setupAuth:', error);
        if (mounted) {
          setError(error as Error);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('🔄 Auth state changed:', _event, session?.user?.email);
      if (mounted) {
        setSession(session);
        if (session?.user) {
          setUserId(session.user.id);
          setUserEmail(session.user.email);
          await fetchUserRole(session.user.id);
        } else {
          setUserRole('user');
          setUserId(null);
          setUserEmail(null);
        }
        setIsLoading(false);
      }
    });

    setupAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      console.log('🔍 Fetching user role for:', userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('roles (name)')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      const role = data?.roles?.name || 'user';
      console.log('✅ User role:', role);
      setUserRole(role);
    } catch (error) {
      console.error('❌ Error fetching role:', error);
      setUserRole('user');
    }
  };

  const signIn = async (credentials: { email: string; password: string }) => {
    // Implementation would go here
    throw new Error("Not implemented");
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value: AuthContextType = {
    session,
    user: session?.user ?? null,
    userRole,
    isLoading,
    error,
    isAuthenticated: !!session?.user,
    userId,
    userEmail,
    loading: isLoading,
    signIn,
    signOut,
    logout: signOut,
  };

  return (
    <AuthContext.Provider value={value}>
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