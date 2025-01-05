import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSkeleton } from '@/components/loading/LoadingSkeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { userId, userRole, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log('🔒 Protected route check:', {
      path: location.pathname,
      userId,
      userRole,
      requiredRole,
      loading
    });
  }, [location.pathname, userId, userRole, requiredRole, loading]);

  if (loading) {
    console.log('⌛ Loading protected route...');
    return <LoadingSkeleton />;
  }

  if (!userId) {
    console.log('❌ No user found, redirecting to root');
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    console.log('❌ User does not have required role, redirecting to dashboard');
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  console.log('✅ User authenticated, rendering protected route');
  return <>{children}</>;
};