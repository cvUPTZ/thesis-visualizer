// import React, { createContext, useContext, useEffect } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { useNavigate } from 'react-router-dom';
// import { useToast } from '@/hooks/use-toast';
// import { supabase } from '@/integrations/supabase/client';

// // Type Definitions
// interface User {
//     id: string;
//     email: string;
//     role: string | null;
// }

// interface AuthState {
//     user: User | null;
//     isAuthenticated: boolean;
// }

// interface Profile {
//     email: string;
//     roles: { name: string } | null;
// }

// interface AuthContextType {
//     user: User | null;
//     userId: string | null;
//     userEmail: string | null;
//     userRole: string | null;
//     isLoading: boolean;
//     isAuthenticated: boolean;
//     signIn: (email: string, password: string) => Promise<void>;
//     signOut: () => Promise<void>;
//     refreshSession: () => Promise<void>;
//     signInError: string | null;
// }

// // Create Context
// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Custom Hook for Auth
// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (!context) {
//         throw new Error('useAuth must be used within an AuthProvider');
//     }
//     return context;
// };

// // Utility Functions
// const saveAuthState = (state: AuthState) => {
//     sessionStorage.setItem('authState', JSON.stringify(state));
// };

// const clearAuthState = () => {
//     sessionStorage.removeItem('authState');
// };

// // Auth Provider Component
// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//     const { toast } = useToast();
//     const navigate = useNavigate();
//     const queryClient = useQueryClient();

//     // Initial Session Query
//     const { data: authData, isLoading: initialLoading } = useQuery({
//         queryKey: ['auth-session'],
//         queryFn: async () => {
//             try {
//                 const { data: { session }, error } = await supabase.auth.getSession();

//                 if (error) throw error;
//                 if (!session?.user) return { user: null, isAuthenticated: false };

//                 const { data: profile, error: profileError } = await supabase
//                     .from('profiles')
//                     .select('email, roles (name)')
//                     .eq('id', session.user.id)
//                     .single();

//                 if (profileError) throw profileError;

//                 const user: User = {
//                     id: session.user.id,
//                     email: (profile as Profile).email,
//                     role: (profile as Profile).roles?.name || null,
//                 };

//                 return { user, isAuthenticated: true };
//             } catch (error) {
//                 console.error('Session fetch error:', error);
//                 return { user: null, isAuthenticated: false };
//             }
//         },
//         staleTime: 1000 * 60 * 5, // 5 minutes
//         cacheTime: 1000 * 60 * 30, // 30 minutes
//     });

//     // Sign In Mutation
//     const signInMutation = useMutation({
//       mutationFn: async ({ email, password }: { email: string; password: string }) => {
//           const { data, error } = await supabase.auth.signInWithPassword({
//               email,
//               password,
//           });

//           if (error) throw error;

//           const { data: profile } = await supabase
//               .from('profiles')
//               .select('roles (name)')
//               .eq('id', data.user.id)
//               .single();

//           return {
//               user: data.user,
//               userRole: profile?.roles?.name || null
//           };
//       },
//       onSuccess: async (data) => {
//          const user : User = {
//             id: data.user.id,
//             email: data.user.email!,
//             role: data.userRole,
//           };

//          queryClient.setQueryData(['auth-session'], { user , isAuthenticated: true });

//           // Show toast
//           toast({
//               title: "Welcome back!",
//               description: "Successfully signed in.",
//           });

//           // Redirect with react router
//          const redirectPath = data.userRole === 'admin' ? '/admin' : '/dashboard';
//           navigate(redirectPath);

//         // Reload the page after navigation
//           window.location.reload();
//       },
//       onError: (error: Error) => {
//           console.error('Sign in error:', error);
//           clearAuthState();
//           toast({
//               title: "Sign in failed",
//               description: error.message,
//               variant: "destructive",
//           });
//       }
//   });

//     // Sign Out Mutation
//     const signOutMutation = useMutation({
//         mutationFn: async () => {
//             const { error } = await supabase.auth.signOut();
//             if (error) throw error;
//         },
//         onSuccess: () => {
//             // Clear auth state
//             clearAuthState();
//            queryClient.setQueryData(['auth-session'], { user: null, isAuthenticated: false });

//             // Show toast
//             toast({
//                 title: "Signed out",
//                 description: "Successfully signed out.",
//             });

//             // Redirect with react router
//             navigate('/auth');
//         },
//         onError: (error: Error) => {
//             console.error('Sign out error:', error);
//             toast({
//                 title: "Sign out failed",
//                 description: error.message,
//                 variant: "destructive",
//             });
//         }
//     });

//     // Auth State Change Listener
//     useEffect(() => {
//         const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
//             if (event === 'SIGNED_OUT') {
//                 clearAuthState();
//                 queryClient.setQueryData(['auth-session'], { user: null, isAuthenticated: false });
//             }
//         });

//         return () => {
//             authListener?.subscription.unsubscribe();
//         };
//     }, [queryClient]);

//     // Context Value
//     const value: AuthContextType = {
//         user: authData?.user ?? null,
//         userId: authData?.user?.id ?? null,
//         userEmail: authData?.user?.email ?? null,
//         userRole: authData?.user?.role ?? null,
//         isLoading: initialLoading,
//         isAuthenticated: authData?.isAuthenticated ?? false,
//         signIn: async (email: string, password: string) => {
//             await signInMutation.mutateAsync({ email, password });
//         },
//         signOut: async () => {
//             await signOutMutation.mutateAsync();
//         },
//         refreshSession: () => queryClient.invalidateQueries({ queryKey: ['auth-session'] }),
//         signInError: signInMutation.error?.message || null,
//     };

//     return (
//         <AuthContext.Provider value={value}>
//             {children}
//         </AuthContext.Provider>
//     );
// };



import React, { createContext, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType } from './auth/types';
import { useSession } from './auth/useSession';
import { useToast } from '@/hooks/use-toast';

const AuthContext = createContext<AuthContextType>({
  userId: null,
  loading: true,
  logout: async () => {},
  isAuthenticated: false,
  userRole: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    userId,
    userRole,
    loading,
    handleSessionChange,
    logout,
    setUserId,
    setUserRole,
    setLoading
  } = useSession();

  useEffect(() => {
    console.log('🔄 Setting up auth state listener...');
    let mounted = true;

    const checkSession = async () => {
      if (!mounted) return;

      try {
        console.log('🔍 Checking session...');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Session error:', sessionError);
          throw sessionError;
        }

        if (session?.user && mounted) {
          console.log('✅ Session found for user:', session.user.email);
          await handleSessionChange(session);
        } else {
          console.log('ℹ️ No active session found');
          if (mounted) {
            setUserId(null);
            setUserRole(null);
            navigate('/welcome');
          }
        }
      } catch (error) {
        console.error('❌ Error checking session:', error);
        if (mounted) {
          setUserId(null);
          setUserRole(null);
          setLoading(false);
          navigate('/welcome');
          toast({
            title: "Error",
            description: "Failed to check authentication status",
            variant: "destructive",
          });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.email);
      
      if (!mounted) {
        console.log('⚠️ Component unmounted, skipping state update');
        return;
      }

      try {
        if (event === 'SIGNED_IN') {
          console.log('✅ User signed in:', session?.user?.email);
          await handleSessionChange(session);
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 User signed out');
          setUserId(null);
          setUserRole(null);
          setLoading(false);
          navigate('/welcome');
        } else if (event === 'TOKEN_REFRESHED') {
          console.log('🔄 Token refreshed for user:', session?.user?.email);
          await handleSessionChange(session);
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

    // Initial session check
    checkSession();

    // Cleanup function
    return () => {
      console.log('🧹 Cleaning up auth state listener...');
      mounted = false;
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array since we only want to set up the listener once

  return (
    <AuthContext.Provider value={{ 
      userId, 
      loading, 
      logout,
      isAuthenticated: !!userId,
      userRole 
    }}>
      {children}
    </AuthContext.Provider>
  );
};