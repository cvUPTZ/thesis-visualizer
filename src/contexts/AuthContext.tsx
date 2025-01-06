import { createContext, useContext, useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  session: Session | null;
  isAuthenticated: boolean;
  userId: string | null;
  userEmail: string | null;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  isAuthenticated: false,
  userId: null,
  userEmail: null,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const initSession = async () => {
      try {
        console.log('🔐 Initializing auth session...');
        
        // Get stored session
        const { data: { session: storedSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Error getting stored session:', sessionError);
          // Clear any invalid session data
          await supabase.auth.signOut();
          setSession(null);
          navigate('/auth');
          return;
        }

        if (storedSession) {
          console.log('✅ Stored session found:', storedSession.user?.email);
          // Verify the session is still valid
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          
          if (userError || !user) {
            console.error('❌ Invalid session detected:', userError);
            await supabase.auth.signOut();
            setSession(null);
            navigate('/auth');
            return;
          }
          
          setSession(storedSession);
        } else {
          console.log('ℹ️ No stored session found');
          navigate('/auth');
        }

      } catch (error) {
        console.error('❌ Error in session initialization:', error);
        // Clear any problematic session state
        await supabase.auth.signOut();
        setSession(null);
        navigate('/auth');
      }
    };

    initSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('🔄 Auth state changed:', event, currentSession?.user?.email);
      
      if (event === 'SIGNED_IN') {
        console.log('✅ User signed in:', currentSession?.user?.email);
        setSession(currentSession);
        toast({
          title: "Welcome back!",
          description: "You have been successfully signed in.",
        });
        navigate('/');
      } else if (event === 'SIGNED_OUT') {
        console.log('👋 User signed out');
        setSession(null);
        toast({
          title: "Signed out",
          description: "You have been successfully signed out.",
        });
        navigate('/auth');
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('🔄 Token refreshed');
        setSession(currentSession);
      } else if (event === 'USER_UPDATED') {
        console.log('👤 User updated');
        setSession(currentSession);
      }
    });

    return () => {
      console.log('🧹 Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const logout = async () => {
    try {
      console.log('🔄 Logging out...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Error during logout:', error);
        toast({
          title: "Error signing out",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
      console.log('✅ Logged out successfully');
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      navigate('/auth');
    } catch (error) {
      console.error('❌ Error in logout process:', error);
      toast({
        title: "Error signing out",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const value = {
    session,
    isAuthenticated: !!session?.user,
    userId: session?.user?.id || null,
    userEmail: session?.user?.email || null,
    logout,
  };

  console.log('🔐 Auth state:', value.isAuthenticated);
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};