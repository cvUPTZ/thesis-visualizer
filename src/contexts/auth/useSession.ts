import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { fetchUserRole } from './userRole';

export const useSession = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSessionChange = async (session: any) => {
    console.log('🔄 Handling session change:', session?.user?.email);
    setLoading(true);
    try {
      if (session?.user) {
        setUserId(session.user.id);
        const role = await fetchUserRole(session.user.id);
        setUserRole(role);
        console.log('✅ Session updated successfully with role:', role);
      } else {
        setUserId(null);
        setUserRole(null);
        navigate('/welcome');
        console.log('ℹ️ Session cleared, redirecting to welcome page');
      }
    } catch (error) {
      console.error('❌ Error handling session change:', error);
      toast({
        title: "Error",
        description: "Failed to load user profile",
        variant: "destructive",
      });
      navigate('/welcome');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      console.log('🔄 Starting logout process...');
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;

      console.log('✅ Logout successful');
      setUserId(null);
      setUserRole(null);
      
      navigate('/welcome');
      
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account.",
      });
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

  return {
    userId,
    setUserId,
    userRole,
    setUserRole,
    loading,
    setLoading,
    handleSessionChange,
    logout
  };
};