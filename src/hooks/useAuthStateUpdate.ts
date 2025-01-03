import { useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '@/contexts/NotificationContext';
import { fetchUserRole } from '@/utils/authUtils';

export const useAuthStateUpdate = (setAuthState: (state: any) => void) => {
  const navigate = useNavigate();
  const { toast } = useNotification();

  return useCallback(async (currentSession: Session | null, showToast = false) => {
    console.log('Updating auth state with session:', currentSession?.user?.email);
    
    try {
      if (!currentSession?.user) {
        setAuthState(state => ({
          ...state,
          isAuthenticated: false,
          userRole: null,
          userId: null,
          user: null,
          session: null,
          loading: false
        }));
        return;
      }

      const role = await fetchUserRole(currentSession.user.id);
      
      setAuthState({
        session: currentSession,
        user: currentSession.user,
        isAuthenticated: true,
        userId: currentSession.user.id,
        userRole: role,
        loading: false
      });

      if (showToast) {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in."
        });
      }
    } catch (error) {
      console.error('Error updating auth state:', error);
      setAuthState(state => ({
        ...state,
        loading: false,
        isAuthenticated: false
      }));
    }
  }, [setAuthState, toast]);
};