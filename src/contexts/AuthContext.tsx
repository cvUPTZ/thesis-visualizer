import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { fetchUserRole } from './auth/userRole';

interface AuthContextType {
  userId: string | null;
  loading: boolean;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  userRole: string | null;
  setLoading: (loading: boolean) => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔄 Initializing auth context...');
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('🔍 Checking initial session...');
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (session?.user && mounted) {
          console.log('✅ Valid session found:', session.user.email);
          setUserId(session.user.id);
          const role = await fetchUserRole(session.user.id);
          setUserRole(role);
        } else {
          console.log('ℹ️ No active session');
          setUserId(null);
          setUserRole(null);
        }
      } catch (error) {
        console.error('❌ Auth initialization error:', error);
        setUserId(null);
        setUserRole(null);
      } finally {
        if (mounted) {
          console.log('✅ Auth initialization complete');
          setLoading(false);
        }
      }
    };

    const subscription = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.email);
      
      if (!mounted) return;

      try {
        if (event === 'SIGNED_IN' && session) {
          console.log('✅ User signed in:', session.user.email);
          setUserId(session.user.id);
          const role = await fetchUserRole(session.user.id);
          setUserRole(role);
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 User signed out');
          setUserId(null);
          setUserRole(null);
          navigate('/welcome');
        }
      } catch (error) {
        console.error('❌ Error handling auth state change:', error);
        toast({
          title: "Error",
          description: "Failed to update authentication state",
          variant: "destructive",
        });
      }
    });

    initializeAuth();

    return () => {
      console.log('🧹 Cleaning up auth context...');
      mounted = false;
      subscription.data.subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const logout = async () => {
    try {
      setLoading(true);
      console.log('🔄 Starting logout process...');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;

      console.log('✅ Logout successful');
      setUserId(null);
      setUserRole(null);
      
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account.",
      });
      
      navigate('/welcome');
    } catch (error: any) {
      console.error('❌ Error during logout:', error);
      toast({
        title: "Error signing out",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{
      userId,
      loading,
      logout,
      isAuthenticated: !!userId,
      userRole,
      setLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};