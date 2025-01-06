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
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Error getting session:', sessionError);
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
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Error during signOut:', error);
        toast({
          title: "Error signing out",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Logout successful');
      setIsAuthenticated(false);
      setUserId(null);
      setUserEmail(null);
      
      toast({
        title: "Success",
        description: "You have been signed out successfully",
      });
      
      navigate('/auth');
    } catch (error: any) {
      console.error('❌ Error during logout:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while signing out",
        variant: "destructive",
      });
      navigate('/auth');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, userEmail, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};