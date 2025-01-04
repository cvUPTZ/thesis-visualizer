import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const savedAuth = localStorage.getItem('authState');
    return savedAuth ? JSON.parse(savedAuth).isAuthenticated : false;
  });
  
  const [loading, setLoading] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string | null>(() => {
    const savedAuth = localStorage.getItem('authState');
    return savedAuth ? JSON.parse(savedAuth).userRole : null;
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('🔍 Checking session...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log('✅ Valid session found, updating user data');
          console.log('🔍 Fetching user role for:', session.user.id);
          
          const { data: profile } = await supabase
            .from('profiles')
            .select(`
              roles (
                name
              )
            `)
            .eq('id', session.user.id)
            .maybeSingle();

          const role = profile?.roles?.name || null;
          
          setUserRole(role);
          setIsAuthenticated(true);
          
          // Save to localStorage
          localStorage.setItem('authState', JSON.stringify({
            isAuthenticated: true,
            userRole: role
          }));
        } else {
          console.log('❌ No valid session found');
          setIsAuthenticated(false);
          setUserRole(null);
          localStorage.removeItem('authState');
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsAuthenticated(false);
        setUserRole(null);
        localStorage.removeItem('authState');
      } finally {
        setLoading(false);
      }
    };

    console.log('🔄 Setting up auth state listener...');
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN' && session) {
        console.log('✅ User signed in:', session.user.email);
        console.log('🔄 Handling session change:', session.user.email);
        
        const { data: profile } = await supabase
          .from('profiles')
          .select(`
            roles (
              name
            )
          `)
          .eq('id', session.user.id)
          .maybeSingle();

        const role = profile?.roles?.name || null;
        
        setUserRole(role);
        setIsAuthenticated(true);
        
        localStorage.setItem('authState', JSON.stringify({
          isAuthenticated: true,
          userRole: role
        }));
      } else if (event === 'SIGNED_OUT') {
        console.log('🗑️ Clearing auth state from localStorage');
        setIsAuthenticated(false);
        setUserRole(null);
        localStorage.removeItem('authState');
      }
      
      setLoading(false);
    });

    return () => {
      console.log('🧹 Cleaning up auth listener...');
      subscription.unsubscribe();
    };
  }, []);

  return { isAuthenticated, loading, userRole };
};