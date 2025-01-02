// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useNotification } from './NotificationContext';

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ERROR'; payload: Error | null }
  | { type: 'RESET_STATE' };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const navigate = useNavigate();
  const { toast } = useNotification();

  const handleError = useCallback((error: Error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
    toast({
      title: 'Authentication Error',
      description: error.message,
      variant: 'destructive',
    });
  }, [toast]);

  const fetchUserRole = useCallback(async (userId: string): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role_id, roles(name)')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data?.roles?.name || 'user';
    } catch (error) {
      console.error('Error fetching user role:', error);
      return 'user';
    }
  }, []);

  const updateAuthState = useCallback(async (session: any) => {
    try {
      if (!session?.user) {
        dispatch({ type: 'RESET_STATE' });
        return;
      }

      const role = await fetchUserRole(session.user.id);
      const user: User = {
        id: session.user.id,
        email: session.user.email,
        role,
      };

      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      handleError(error as Error);
    }
  }, [fetchUserRole, handleError]);

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
        dispatch({ type: 'SET_LOADING', payload: false });
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
