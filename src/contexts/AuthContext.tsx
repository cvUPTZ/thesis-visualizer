// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useNotification } from './NotificationContext';
import { AuthState, AuthContextType, User } from '@/types/auth';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const authReducer = (state: AuthState, action: any): AuthState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        error: null,
      };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'RESET_STATE':
      return { ...initialState, isLoading: false };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();
  const { toast } = useNotification();

    const fetchUserProfile = useCallback(async (userId: string): Promise<User | null> => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, email, roles(name)')
               .eq('id', userId)
               .maybeSingle();

           if (error) {
                console.error('Error fetching user profile:', error);
                return null;
          }

           if(!data) return null;

          return {
               id: data.id,
                email: data.email,
                role: data.roles?.name || 'user',
            };
       } catch (error) {
            console.error('Error fetching user profile:', error);
             return null;
         }
   }, []);

  const handleError = useCallback((error: Error) => {
        dispatch({ type: 'SET_ERROR', payload: error });
      toast({
          title: 'Authentication Error',
           description: error.message,
           variant: 'destructive',
        });
    }, [toast]);

  const updateAuthState = useCallback(async (session: any) => {
    try {
      if (!session?.user) {
          dispatch({ type: 'RESET_STATE' });
         return;
      }

     const user = await fetchUserProfile(session.user.id);
      if(user) {
          dispatch({ type: 'SET_USER', payload: user });
      } else {
        dispatch({ type: 'RESET_STATE' });
      }
    } catch (error) {
      handleError(error as Error);
    }
  }, [fetchUserProfile, handleError]);

  const signOut = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      dispatch({ type: 'RESET_STATE' });
      navigate('/auth', { replace: true });
     toast({
          title: 'Signed out',
          description: 'You have been successfully signed out.',
       });
    } catch (error) {
      handleError(error as Error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [navigate, toast, handleError]);

  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  useEffect(() => {
    let mounted = true;

     const initialize = async () => {
         try {
            dispatch({ type: 'SET_LOADING', payload: true });
           const { data: { session }, error } = await supabase.auth.getSession();
            if (error) throw error;
            if (mounted) await updateAuthState(session);
         } catch (error) {
              if (mounted) handleError(error as Error);
         } finally {
              if (mounted) dispatch({ type: 'SET_LOADING', payload: false });
          }
    };

      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!mounted) return;

        try {
          dispatch({ type: 'SET_LOADING', payload: true });
            switch (event) {
                case 'SIGNED_IN':
                    await updateAuthState(session);
                   break;
               case 'SIGNED_OUT':
                  dispatch({ type: 'RESET_STATE' });
                    break;
              case 'TOKEN_REFRESHED':
                    await updateAuthState(session);
                    break;
            }
       } catch (error) {
            handleError(error as Error);
         } finally {
          if (mounted) dispatch({ type: 'SET_LOADING', payload: false });
         }
      });

       initialize();

       return () => {
           mounted = false;
          subscription.unsubscribe();
       };
   }, [updateAuthState, handleError]);

  return (
    <AuthContext.Provider value={{ ...state, signOut, clearError }}>
      {children}
    </AuthContext.Provider>
  );
};