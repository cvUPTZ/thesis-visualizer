import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface WithAuthorizationProps {
  children: React.ReactNode;
  requiredRole?: string | null;
}

const withAuthorization = (WrappedComponent: React.ComponentType) => {
  const WithAuthorization: React.FC<WithAuthorizationProps> = ({ children, requiredRole }) => {
    const { isAuthenticated, userRole, loading } = useAuth();

      if(loading) {
          return <></>
      }

    if (!isAuthenticated) {
        console.log('🚫 User not authenticated, redirecting to /auth');
      return <Navigate to="/auth" />;
    }

      if (requiredRole && userRole !== requiredRole) {
          console.log('🚫 User not authorized, redirecting to /');
        return <Navigate to="/" />;
    }
      console.log('✅ Access granted to route with role:', userRole);
    return <WrappedComponent>{children}</WrappedComponent>;
  };

  return WithAuthorization;
};

export default withAuthorization;