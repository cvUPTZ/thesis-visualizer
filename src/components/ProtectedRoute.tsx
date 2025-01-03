// src/components/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: string;
}

export const ProtectedRoute = ({ children, requireRole }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, userRole } = useAuth();
  const location = useLocation();
    const [authCheckTimeout, setAuthCheckTimeout] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
      if (loading) {
          timeoutId = setTimeout(() => {
              console.log('Auth check taking longer than expected...');
              setAuthCheckTimeout(true)
          }, 5000);
      } else {
          setAuthCheckTimeout(false)
      }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [loading]);

    if (loading && !authCheckTimeout) {
    return <LoadingScreen title="Checking authentication..." />;
  }

    if(loading && authCheckTimeout) {
        return <LoadingScreen title="Authentication check is taking longer than expected"/>
    }


  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requireRole && userRole !== requireRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};