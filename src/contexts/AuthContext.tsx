import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  userRole?: string;
  userId?: string;
  userEmail?: string;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  isLoading: true,
  isAuthenticated: false,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>();
  
  useEffect(() => {
    let mounted = true;
    console.info("🔄 Initializing auth context...");
    
    const initializeAuth = async () => {
      try {
        console.info("🔍 Checking initial session...");
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (initialSession) {
          console.info("✅ Found initial session:", initialSession.user.email);
          setSession(initialSession);
          setUser(initialSession.user);
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('roles (name)')
            .eq('id', initialSession.user.id)
            .single();
            
          if (profile?.roles && mounted) {
            console.log('✅ User role loaded:', profile.roles.name);
            setUserRole(profile.roles.name);
          }
        } else {
          console.info("ℹ️ No active session found");
          if (mounted) {
            setSession(null);
            setUser(null);
          }
        }
      } catch (error) {
        console.error("❌ Error checking session:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.info("🔄 Auth state changed:", event, currentSession?.user?.email);
        
        if (!mounted) return;
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('roles (name)')
            .eq('id', currentSession.user.id)
            .single();
            
          if (profile?.roles && mounted) {
            setUserRole(profile.roles.name);
          }
        }
        
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      console.log('🔄 Starting logout process...');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Error during logout:', error);
      throw error;
    }
  };

  const value = {
    session,
    user,
    loading,
    isLoading: loading,
    isAuthenticated: !!session,
    userRole,
    userId: user?.id,
    userEmail: user?.email,
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