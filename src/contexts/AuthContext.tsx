import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AuthError, AuthResponse, User, AuthChangeEvent } from '@supabase/supabase-js';

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  userEmail: string | null;
  handleLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userId: null,
  userEmail: null,
  handleLogout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log('🔐 Initializing auth session...');
    
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          console.log('✅ Stored session found:', session.user.email);
          setIsAuthenticated(true);
          setUserId(session.user.id);
          setUserEmail(session.user.email);
        } else {
          console.log('ℹ️ No stored session found');
          setIsAuthenticated(false);
          setUserId(null);
          setUserEmail(null);
        }
      } catch (error) {
        console.error('❌ Error initializing session:', error);
        setIsAuthenticated(false);
        setUserId(null);
        setUserEmail(null);
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.email);

      switch (event) {
        case 'SIGNED_IN':
          if (session?.user) {
            console.log('✅ User signed in:', session.user.email);
            setIsAuthenticated(true);
            setUserId(session.user.id);
            setUserEmail(session.user.email);
            navigate('/');
          }
          break;

        case 'SIGNED_OUT':
          console.log('👋 User signed out');
          setIsAuthenticated(false);
          setUserId(null);
          setUserEmail(null);
          navigate('/auth');
          break;

        case 'TOKEN_REFRESHED':
          console.log('🔄 Token refreshed');
          if (session?.user) {
            setIsAuthenticated(true);
            setUserId(session.user.id);
            setUserEmail(session.user.email);
          }
          break;

        case 'USER_UPDATED':
          console.log('👤 User profile updated');
          await initSession();
          break;
      }
    });

    return () => {
      console.log('🧹 Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      console.log('🔄 Starting logout process...');
      
      // First update local state
      setIsAuthenticated(false);
      setUserId(null);
      setUserEmail(null);
      
      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('❌ Error during signOut:', error);
        throw error;
      }
      
      console.log('✅ Logout successful');
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account.",
      });
      
      // Finally navigate to auth page
      navigate('/auth');
    } catch (error: any) {
      console.error('❌ Error during logout:', error);
      toast({
        title: "Error signing out",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      
      // Even if there's an error, we should redirect to auth page
      navigate('/auth');
    }
  };

  console.log('🔐 Auth state:', isAuthenticated);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, userEmail, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};