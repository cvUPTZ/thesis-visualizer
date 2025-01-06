import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  userEmail: string | null;
  handleLogout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log('🔐 Initializing auth session...');

    const initSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('❌ Error getting session:', sessionError);
          setLoading(false);
          return;
        }

        if (session) {
          console.log('✅ Valid session found:', session.user.email);
          setIsAuthenticated(true);
          setUserId(session.user.id);
          setUserEmail(session.user.email);
        } else {
          console.log('ℹ️ No active session');
          setIsAuthenticated(false);
          setUserId(null);
          setUserEmail(null);
          navigate('/auth');
        }
        setLoading(false);
      } catch (error) {
        console.error('❌ Error initializing session:', error);
        setLoading(false);
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.email);

      if (event === 'SIGNED_IN' && session) {
        console.log('✅ User signed in:', session.user.email);
        setIsAuthenticated(true);
        setUserId(session.user.id);
        setUserEmail(session.user.email);
      } else if (event === 'SIGNED_OUT') {
        console.log('👋 User signed out');
        setIsAuthenticated(false);
        setUserId(null);
        setUserEmail(null);
        navigate('/auth');
      }
    });

    return () => {
      console.log('🧹 Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    console.log('🔄 Starting logout process...');
    setLoading(true);
    
    try {
      // First, clear local session state
      setIsAuthenticated(false);
      setUserId(null);
      setUserEmail(null);
      
      // Then attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        // Ignore session_not_found error as we've already cleared local state
        if (error.message.includes('session_not_found')) {
          console.log('ℹ️ Session already expired');
          toast({
            title: "Logged out",
            description: "You have been signed out successfully",
          });
        } else {
          console.error('❌ Error during signOut:', error);
          toast({
            title: "Notice",
            description: "You have been signed out, but there was an issue with the server",
            variant: "default",
          });
        }
      } else {
        console.log('✅ Logout successful');
        toast({
          title: "Success",
          description: "You have been signed out successfully",
        });
      }
    } catch (error: any) {
      console.error('❌ Unexpected error during logout:', error);
      toast({
        title: "Notice",
        description: "You have been signed out locally",
        variant: "default",
      });
    } finally {
      setLoading(false);
      navigate('/auth');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, userEmail, handleLogout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};