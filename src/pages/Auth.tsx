import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContainer } from '@/components/auth/AuthContainer';
import { AuthLoader } from '@/components/auth/AuthLoader';
import { useAuth } from '@/contexts/AuthContext';

export const Auth = () => {
  const { isAuthenticated, isLoading, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🔄 Auth page mounted. Auth state:', { isAuthenticated, isLoading, userRole });
    
    if (!isLoading && isAuthenticated) {
      console.log('✅ User is authenticated, redirecting based on role:', userRole);
      if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, userRole, isLoading, navigate]);

  console.log('🔄 Rendering Auth page with state:', { isLoading, isAuthenticated });

  if (isLoading) {
    return <AuthLoader />;
  }

  if (isAuthenticated) {
    return null;
  }

  return <AuthContainer />;
};

export default Auth;