import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSkeleton } from '@/components/loading/LoadingSkeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { userId, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log('🔒 Protected route check:', {
      path: location.pathname,
      userId,
      loading
    });
  }, [location.pathname, userId, loading]);

  if (loading) {
    console.log('⌛ Loading protected route...');
    return <LoadingSkeleton />;
  }

  if (!userId) {
    console.log('❌ No user found, redirecting to welcome page');
    return <Navigate to="/welcome" state={{ from: location }} replace />;
  }

  console.log('✅ User authenticated, rendering protected route');
  return <>{children}</>;
};