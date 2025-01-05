import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContainer } from '@/components/auth/AuthContainer';
import { AuthLoader } from '@/components/auth/AuthLoader';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const Auth = () => {
  const { isAuthenticated, isLoading, userRole, error } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log('🔄 Auth page mounted. State:', { isAuthenticated, isLoading, userRole });
    
    if (error) {
      console.error('❌ Auth error:', error);
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive",
      });
    }

    if (!isLoading && isAuthenticated && userRole) {
      console.log('✅ User authenticated, redirecting based on role:', userRole);
      if (userRole === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, userRole, error, navigate, toast]);

  if (isLoading) {
    return <AuthLoader />;
  }

  if (isAuthenticated) {
    return null;
  }

  return <AuthContainer />;
};

export default Auth;