import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { AuthContextType } from "@/types/auth";

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  userRole: 'user',
  userId: null,
  userEmail: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  signOut: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState('user');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log('🔄 Setting up auth...');
    
    const setupAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log('📍 Initial session:', session?.user?.email);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('roles (name)')
            .eq('id', session.user.id)
            .single();
            
          setUserRole(profile?.roles?.name || 'user');
        }
      } catch (error) {
        console.error('❌ Error in setupAuth:', error);
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('🔄 Auth state changed:', _event, session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('roles (name)')
          .eq('id', session.user.id)
          .single();
          
        setUserRole(profile?.roles?.name || 'user');
      } else {
        setUserRole('user');
      }
      
      setIsLoading(false);
    });

    setupAuth();
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Added this function to match both signOut and logout functionality
  const logout = async () => {
    await signOut();
  };

  const value = {
    user,
    session,
    userRole,
    userId: user?.id ?? null,
    userEmail: user?.email ?? null,
    isAuthenticated: !!user,
    isLoading,
    error,
    signOut,
    logout,
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