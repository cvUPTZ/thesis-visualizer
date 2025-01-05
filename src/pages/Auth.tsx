import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContainer } from '@/components/auth/AuthContainer';
import { useAuth } from '@/contexts/AuthContext';

export const Auth = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/dashboard');
    }
  }, [session, navigate]);

  if (session) {
    return null;
  }

  return <AuthContainer />;
};

export default Auth;