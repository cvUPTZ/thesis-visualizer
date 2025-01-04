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
  const { user, isAuthenticated } = useAuth();
  
  // Skip auth check for public routes
  if (!requireAuth) {
    return <>{children}</>;
  }

  // Redirect to welcome page if not authenticated
  if (!isAuthenticated && requireAuth) {
    return <Navigate to="/welcome" replace />;
  }

  return <>{children}</>;
};