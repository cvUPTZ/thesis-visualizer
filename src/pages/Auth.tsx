import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContainer } from '@/components/auth/AuthContainer';
import { AuthLoader } from '@/components/auth/AuthLoader';
import { useAuth } from '@/contexts/AuthContext';

const Auth = () => {
  const { session, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/dashboard');
    }
  }, [session, navigate]);

  if (isLoading) {
    return <AuthLoader />;
  }

  if (session) {
    return null;
  }

  return <AuthContainer />;
};

export default Auth;