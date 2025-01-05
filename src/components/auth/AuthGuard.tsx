import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSkeleton } from '@/components/loading/LoadingSkeleton';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export const AuthGuard = ({ children, requiredRole }: AuthGuardProps) => {
  const { isAuthenticated, isLoading, userRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🔒 AuthGuard - Checking auth state:', { isAuthenticated, userRole, requiredRole });
    
    if (!isLoading) {
      if (!isAuthenticated) {
        console.log('🚫 User not authenticated, redirecting to auth page');
        navigate('/auth');
      } else if (requiredRole && userRole !== requiredRole) {
        console.log(`🚫 User does not have required role: ${requiredRole}`);
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, userRole, requiredRole, navigate]);

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

  if (!isAuthenticated) {
    return null;
  }

  if (requiredRole && userRole !== requiredRole) {
    return null;
  }

  return <>{children}</>;
};