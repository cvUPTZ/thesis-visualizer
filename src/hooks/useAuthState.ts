import { useState } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  userEmail: string | null;
  loading: boolean;
}

export const useAuthState = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const clearAuthState = () => {
    setIsAuthenticated(false);
    setUserId(null);
    setUserEmail(null);
  };

  return {
    authState: {
      isAuthenticated,
      userId,
      userEmail,
      loading
    },
    setters: {
      setIsAuthenticated,
      setUserId,
      setUserEmail,
      setLoading
    },
    clearAuthState
  };
};