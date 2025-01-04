import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useSession } from './auth/useSession';

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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    userId,
    userRole,
    loading: sessionLoading,
    handleSessionChange,
    logout,
    setUserId,
    setUserRole,
    setLoading: setSessionLoading
  } = useSession();
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        if (session?.user && mounted) {
          await handleSessionChange(session);
        } else if (mounted) {
          setUserId(null);
          setUserRole(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setUserId(null);
          setUserRole(null);
        }
      } finally {
        if (mounted) {
          setAuthLoading(false);
          setSessionLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === 'SIGNED_IN' && session) {
        await handleSessionChange(session);
      } else if (event === 'SIGNED_OUT') {
        setUserId(null);
        setUserRole(null);
        setSessionLoading(false);
        navigate('/welcome');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, handleSessionChange, setSessionLoading, setUserId, setUserRole]);

  return (
    <AuthContext.Provider value={{
      userId,
      loading: authLoading,
      logout,
      isAuthenticated: !!userId,
      userRole,
      setLoading: setSessionLoading
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