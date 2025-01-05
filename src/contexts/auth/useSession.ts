import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { fetchUserRole } from './userRole';

export const useSession = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSessionChange = async (session: any) => {
    console.log('🔄 Handling session change:', session?.user?.email);
    setLoading(true);

    try {
      if (session?.user) {
        console.log('✅ Valid session found, updating user data');
        setUserId(session.user.id);
        const role = await fetchUserRole(session.user.id);
        setUserRole(role);
        console.log('✅ Session updated successfully with role:', role);
      } else {
        console.log('ℹ️ No valid session, clearing user data');
        setUserId(null);
        setUserRole(null);
        navigate('/welcome');
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
      console.log('🔄 Starting logout process...');
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Error during logout:', error);
        throw error;
      }

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