import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSkeleton } from '@/components/loading/LoadingSkeleton';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const AuthGuard = ({ children, requiredRole }: AuthGuardProps) => {
  const { isAuthenticated, isLoading, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('🚫 User not authenticated, redirecting to auth page');
      navigate('/auth');
    } else if (!isLoading && requiredRole && userRole !== requiredRole) {
      console.log(`🚫 User does not have required role: ${requiredRole}`);
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, userRole, requiredRole, navigate]);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && userRole !== requiredRole) {
    return null;
  }

  return <>{children}</>;
};