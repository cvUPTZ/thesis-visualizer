import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useNotification } from './NotificationContext';
import { AuthState, getInitialAuthState, handleAuthError, initializeAuth } from '@/utils/authUtils';
import { useAuthStateUpdate } from '@/hooks/useAuthStateUpdate';

interface AuthContextType extends AuthState {
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  ...getInitialAuthState(),
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(getInitialAuthState());
  const navigate = useNavigate();
  const { toast } = useNotification();
  const updateAuthState = useAuthStateUpdate(setAuthState);

  const signOut = async () => {
    try {
      setAuthState(state => ({ ...state, loading: true }));
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: "Success",
        description: "You have been signed out successfully."
      });
      
      handleAuthError(navigate);
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      });
    } finally {
      setAuthState(state => ({ ...state, loading: false }));
    }
  };

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      const { session, error } = await initializeAuth();
      
      if (!mounted) return;
      
      if (error || !session) {
        handleAuthError(navigate);
        setAuthState(state => ({ ...state, loading: false }));
        return;
      }

      await updateAuthState(session);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.email);
        
        if (!mounted) return;

        try {
          switch (event) {
            case 'SIGNED_IN':
              await updateAuthState(currentSession, true);
              navigate('/dashboard', { replace: true });
              break;
            case 'SIGNED_OUT':
              handleAuthError(navigate);
              break;
            case 'TOKEN_REFRESHED':
            case 'USER_UPDATED':
              if (currentSession) {
                await updateAuthState(currentSession);
              } else {
                handleAuthError(navigate);
              }
              break;
          }
        } catch (error) {
          console.error('Error handling auth state change:', error);
          handleAuthError(navigate);
        }
      }
    );

    initialize();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, updateAuthState]);

  return (
    <AuthContext.Provider 
      value={{ 
        ...authState,
        signOut 
      }}
    >
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