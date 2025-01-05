import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSkeleton } from '@/components/loading/LoadingSkeleton';

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, userRole, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (user) {
    return <Navigate to={userRole === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return <>{children}</>;
};