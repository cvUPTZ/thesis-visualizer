import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AuthLoader } from "@/components/auth/AuthLoader";
import { AuthContainer } from "@/components/auth/AuthContainer";

const Auth = () => {
  const { isLoading, isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log('Auth component mount - Auth state:', { isAuthenticated, userRole, isLoading });
    
    if (!isLoading && isAuthenticated) {
      console.log('✅ User is authenticated, redirecting based on role:', userRole);
      if (userRole === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, userRole, isLoading, navigate]);

  if (isLoading) {
    console.log('⌛ Loading auth component...');
    return <AuthLoader />;
  }

  if (isAuthenticated) {
    return null;
  }

  return <AuthContainer />;
};

export default Auth;