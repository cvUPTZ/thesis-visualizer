import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSkeleton } from '@/components/loading/LoadingSkeleton';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiredRole }) => {
  const { user, isLoading, userRole } = useAuth();
  const location = useLocation();

  console.log('🔒 AuthGuard Check:', {
    path: location.pathname,
    isLoading,
    user: user?.email,
    userRole,
    requiredRole
  });

  if (isLoading) {
    console.log('⌛ Loading auth guard...');
    return <LoadingSkeleton />;
  }

  if (!user) {
    console.log('❌ User not authenticated, redirecting to auth');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    console.log('❌ User does not have required role, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('✅ Access granted to protected route');
  return <>{children}</>;
};