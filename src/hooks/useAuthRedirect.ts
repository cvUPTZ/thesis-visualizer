// src/hooks/useAuthRedirect.ts
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && location.pathname === '/auth') {
        navigate(from, { replace: true });
      } else if (!isAuthenticated && location.pathname !== '/auth' && location.pathname !== '/') {
        navigate('/auth', { state: { from: location }, replace: true });
      }
    }
  }, [isAuthenticated, isLoading, location, navigate, from]);
};