import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '@/contexts/NotificationContext';
import { useQuery } from '@tanstack/react-query';
import { thesisService } from '@/services/thesisService';

export const useUser = () => {
  const [userEmail, setUserEmail] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');
  const navigate = useNavigate();
  const { toast } = useNotification();
  const { data: profile } = useQuery({
        queryKey: ['user-profile-hook'],
         queryFn: async () => {
          const { data: { session } } = await supabase.auth.getSession()
             if(!session) return null;
           return thesisService.getUserProfile(session.user.id);
        }
    });

    useEffect(() => {
        let mounted = true;
        const checkSession = async () => {
          try {
               const { data: { session }, error: sessionError } = await supabase.auth.getSession();

             if (sessionError) {
                    console.error('Session error:', sessionError);
                    if (mounted) {
                        setUserEmail('');
                      setUserRole('');
                        navigate('/auth');
                    }
                    return;
                }

               if (!session) {
                    console.log('No session found');
                   if (mounted) {
                        setUserEmail('');
                       setUserRole('');
                       navigate('/auth');
                    }
                  return;
               }
             if(profile && mounted) {
                   console.log('Profile loaded:', profile);
                  setUserEmail(profile.email);
                    setUserRole(profile.role || '');
             }
          } catch (error) {
                console.error('Error checking session:', error);
               if (mounted) navigate('/auth');
            }
        };

       checkSession();
       const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('Auth state changed:', event, session);
          if (event === 'SIGNED_OUT') {
               if (mounted) {
                   setUserEmail('');
                    setUserRole('');
                    navigate('/auth');
               }
          } else if (event === 'SIGNED_IN' && session) {
              try {
                const profile = await thesisService.getUserProfile(session.user.id)
                  if (profile && mounted) {
                      setUserEmail(profile.email);
                        setUserRole(profile.role || '');
                    }
                } catch (error) {
                    console.error('Error in auth state change handler:', error);
                }
            }
       });

       return () => {
          mounted = false;
          authListener?.subscription.unsubscribe();
        };
    }, [navigate, toast, profile]);


  const handleLogout = async () => {
        try {
            // Clear local state first
          setUserEmail('');
          setUserRole('');

         const { error } = await supabase.auth.signOut();

        if (error) {
          console.error('Error signing out:', error);
               toast({
                   title: "Error",
                    description: "Failed to sign out. Please try again.",
                    variant: "destructive"
               });
            } else {
               toast({
                    title: "Success",
                  description: "You have been signed out successfully."
                });
                navigate('/auth');
          }
       } catch (error) {
            console.error('Error in handleLogout:', error);
           toast({
                title: "Error",
               description: "An unexpected error occurred while signing out.",
               variant: "destructive"
           });
        }
    };

    return { userEmail, userRole, handleLogout };
};