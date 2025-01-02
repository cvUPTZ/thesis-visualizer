// src/components/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: string;
}

export const ProtectedRoute = ({ children, requireRole }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, userRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen title="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requireRole && userRole !== requireRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};