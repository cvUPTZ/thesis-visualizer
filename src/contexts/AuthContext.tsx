import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  session: Session | null;
  user: User | null;
  isAuthenticated: boolean;
  userRole: string | null;
  userId: string | null;
  userEmail: string | null;
  isLoading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  isAuthenticated: false,
  userRole: null,
  userId: null,
  userEmail: null,
  isLoading: true,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🔄 Setting up auth listener...');
    
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        if (session?.user) {
          await fetchUserRole(session.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log('🔄 Auth state changed:', _event);
      setIsLoading(true);
      
      try {
        setSession(session);
        
        if (session?.user) {
          console.log('✅ User authenticated:', session.user.email);
          await fetchUserRole(session.user.id);
          navigate('/dashboard');
        } else {
          console.log('ℹ️ User not authenticated');
          setUserRole(null);
          navigate('/auth');
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
      } finally {
        setIsLoading(false);
      }
    });

    return () => {
      console.log('🧹 Cleaning up auth listener...');
      subscription.unsubscribe();
    };
  }, [navigate]);

  const fetchUserRole = async (userId: string) => {
    try {
      console.log('🔍 Fetching role for user:', userId);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('roles (name)')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user role:', error);
        throw error;
      }
      
      const role = profile?.roles?.name || 'user';
      console.log('✅ User role fetched:', role);
      setUserRole(role);
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole('user');
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account.",
      });
      navigate('/auth');
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Error signing out",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    session,
    user: session?.user ?? null,
    isAuthenticated: !!session?.user,
    userRole,
    userId: session?.user?.id ?? null,
    userEmail: session?.user?.email ?? null,
    isLoading,
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