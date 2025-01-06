import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  userEmail: string | null;
  handleLogout: () => Promise<void>;
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
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log('🔐 Initializing auth session...');
    
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.log('✅ Stored session found:', session.user.email);
          setIsAuthenticated(true);
          setUserId(session.user.id);
          setUserEmail(session.user.email);
        }
      } catch (error) {
        console.error('❌ Error initializing session:', error);
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
    
    // Clear local state first
    setIsAuthenticated(false);
    setUserId(null);
    setUserEmail(null);

    try {
      // Attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Error during signOut:', error);
        toast({
          title: "Warning",
          description: "You have been signed out locally. Please refresh the page.",
          variant: "destructive",
        });
      } else {
        console.log('✅ Logout successful');
        toast({
          title: "Success",
          description: "You have been signed out successfully.",
        });
      }
    } catch (error) {
      console.error('❌ Error during logout:', error);
      toast({
        title: "Warning",
        description: "You have been signed out locally. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      // Always navigate to auth page
      console.log('🔄 Navigating to auth page...');
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