import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  handleLogout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userId: null,
  handleLogout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
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
        } else {
          console.log('ℹ️ No stored session found');
          setIsAuthenticated(false);
          setUserId(null);
        }
      } catch (error) {
        console.error('❌ Error initializing session:', error);
        setIsAuthenticated(false);
        setUserId(null);
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.email);

      switch (event) {
        case 'SIGNED_IN':
          if (session?.user) {
            console.log('✅ User signed in:', session.user.email);
            setIsAuthenticated(true);
            setUserId(session.user.id);
            navigate('/');
          }
          break;

        case 'SIGNED_OUT':
          console.log('👋 User signed out');
          setIsAuthenticated(false);
          setUserId(null);
          navigate('/auth');
          break;

        case 'TOKEN_REFRESHED':
          console.log('🔄 Token refreshed');
          if (session?.user) {
            setIsAuthenticated(true);
            setUserId(session.user.id);
          }
          break;

        case 'USER_DELETED':
        case 'USER_UPDATED':
          console.log('👤 User profile updated:', event);
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
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account.",
      });
      
      navigate('/auth');
    } catch (error: any) {
      console.error('❌ Error during logout:', error);
      toast({
        title: "Error signing out",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  console.log('🔐 Auth state:', isAuthenticated);

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};