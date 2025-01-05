import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, loading, userRole } = useAuth();
  const [showLoading, setShowLoading] = useState(true);
  
  console.log('🔒 Protected Route Check:', { isAuthenticated, loading, userRole });

  useEffect(() => {
    // Only show loading state for 2 seconds max
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading && showLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('❌ Access denied: User not authenticated');
    return <Navigate to="/auth" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    console.log('❌ Access denied: Insufficient permissions');
    return <Navigate to="/" replace />;
  }

  console.log('✅ Access granted to protected route');
  return <>{children}</>;
};

export default ProtectedRoute;