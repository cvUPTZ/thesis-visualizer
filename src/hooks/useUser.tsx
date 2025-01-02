
// src/hooks/useUser.tsx
import { useCallback, useReducer, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '@/contexts/NotificationContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { thesisService } from '@/services/thesisService';

interface UserState {
  email: string;
  role: string;
  isLoading: boolean;
  error: Error | null;
}

type UserAction =
  | { type: 'SET_USER'; payload: { email: string; role: string; } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error | null }
  | { type: 'RESET' };

const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        email: action.payload.email,
        role: action.payload.role,
        isLoading: false,
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'RESET':
      return { ...initialState };
    default:
      return state;
  }
};

const initialState: UserState = {
  email: '',
  role: '',
  isLoading: true,
  error: null,
};

export const useUser = () => {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const navigate = useNavigate();
  const { toast } = useNotification();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ['user-profile-hook'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;
      return thesisService.getUserProfile(session.user.id);
    },
    retry: 1,
  });

  useEffect(() => {
    let mounted = true;

    if (profile && mounted) {
      dispatch({
        type: 'SET_USER',
        payload: {
          email: profile.email,
          role: profile.role || '',
        },
      });
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        switch (event) {
          case 'SIGNED_OUT':
            dispatch({ type: 'RESET' });
            navigate('/auth');
            break;
          case 'SIGNED_IN':
            if (session) {
              try {
                const profile = await thesisService.getUserProfile(session.user.id);
                if (profile && mounted) {
                  dispatch({
                    type: 'SET_USER',
                    payload: {
                      email: profile.email,
                      role: profile.role || '',
                    },
                  });
                }
              } catch (error) {
                dispatch({ type: 'SET_ERROR', error as Error });
                navigate('/auth');
              }
            }
            break;
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, profile]);

  const handleLogout = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;

      dispatch({ type: 'RESET' });
      queryClient.clear();
      
      toast({
        title: "Success",
        description: "You have been signed out successfully."
      });
      
      navigate('/auth');
    } catch (error) {
      console.error('Error in handleLogout:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while signing out.",
        variant: "destructive"
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [navigate, toast, queryClient]);

  return {
    ...state,
    handleLogout,
  };
};
