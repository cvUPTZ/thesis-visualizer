import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSkeleton } from '@/components/loading/LoadingSkeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { isAuthenticated, isLoading, userRole } = useAuth();
  const location = useLocation();

  console.log('🔒 Protected route check:', {
    path: location.pathname,
    isAuthenticated,
    userRole,
    requiredRole,
    isLoading
  });

  if (isLoading) {
    console.log('⌛ Loading protected route...');
    return <LoadingSkeleton />;
  }

  if (!isAuthenticated) {
    console.log('❌ User not authenticated, redirecting to auth');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    console.log('❌ User does not have required role, redirecting to dashboard');
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  console.log('✅ Access granted to protected route');
  return <>{children}</>;
};