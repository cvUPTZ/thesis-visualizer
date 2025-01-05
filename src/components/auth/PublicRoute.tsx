import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSkeleton } from '@/components/loading/LoadingSkeleton';
export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
const { isAuthenticated, isLoading, userRole } = useAuth();
const navigate = useNavigate();

useEffect(() => {
        if (!isLoading ) {
         if (isAuthenticated) {
          console.log('✅ User is authenticated, redirecting based on role:', userRole);
          if (userRole === 'admin') {
            navigate('/admin', { replace: true });
            } else {
            navigate('/dashboard', { replace: true });
          }
          }
        }
  }, [isAuthenticated, isLoading, userRole, navigate]);


  if (isLoading) {
      return <LoadingSkeleton />;
  }
  if (isAuthenticated) {
    return null;
  }
  return <>{children}</>;
};