import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSkeleton } from '@/components/loading/LoadingSkeleton';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiredRole }) => {
  const { user, isLoading, userRole, isRoleLoading } = useAuth();
  const location = useLocation();

  console.log('🔒 AuthGuard Check:', {
    path: location.pathname,
    isLoading,
    isRoleLoading,
    user: user?.email,
    userRole,
    requiredRole
  });

  // Show loading while either auth or role is loading
  if (isLoading || isRoleLoading) {
    console.log('⌛ Loading auth guard... Auth loading:', isLoading, 'Role loading:', isRoleLoading);
    return <LoadingSkeleton />;
  }

  // If not authenticated, redirect to auth page
  if (!user) {
    console.log('❌ User not authenticated, redirecting to auth');
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // If role is required and user doesn't have it, redirect to dashboard
  if (requiredRole && userRole !== requiredRole) {
    console.log('❌ User does not have required role, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('✅ Access granted to protected route');
  return <>{children}</>;
};