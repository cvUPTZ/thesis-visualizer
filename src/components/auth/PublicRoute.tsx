import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🔒 PublicRoute - Checking auth state:', { isAuthenticated, userRole, isLoading });
    
    if (!isLoading && isAuthenticated) {
      console.log('✅ User is authenticated, redirecting based on role:', userRole);
      if (userRole === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, userRole, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};