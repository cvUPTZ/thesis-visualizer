// src/hooks/useAuthRedirect.ts
import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const PUBLIC_ROUTES = ['/', '/auth', '/privacy', '/terms'];

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  const from = useMemo(() => 
    location.state?.from?.pathname || '/dashboard',
    [location.state]
  );

  const isPublicRoute = useMemo(() => 
    PUBLIC_ROUTES.includes(location.pathname),
    [location.pathname]
  );

  useEffect(() => {
    if (isLoading) return;

    if (isAuthenticated && location.pathname === '/auth') {
      navigate(from, { replace: true });
    } else if (!isAuthenticated && !isPublicRoute) {
      navigate('/auth', { 
        state: { from: location }, 
        replace: true 
      });
    }
  }, [isAuthenticated, isLoading, location, navigate, from, isPublicRoute]);

  return { isLoading };
};