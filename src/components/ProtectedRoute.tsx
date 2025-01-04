import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAuth = true 
}) => {
  const { session, isLoading } = useAuth();
  
  // Skip session check for public routes
  if (!requireAuth) {
    return <>{children}</>;
  }

  // Show loading state while checking auth
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Redirect to welcome page if not authenticated
  if (!session && requireAuth) {
    return <Navigate to="/welcome" replace />;
  }

  return <>{children}</>;
};