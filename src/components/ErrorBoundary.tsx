import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { AlertCircle, RefreshCw, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  retryCount: number;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  async componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error);
    this.setState({ errorInfo });
    
    try {
      // Check if it's an auth error
      const isAuthError = error.message.includes('auth/v1/user') || 
                         error.message.includes('auth/v1/token');

      if (isAuthError) {
        console.log('Auth error detected, attempting to refresh session...');
        const { data: { session }, error: refreshError } = await supabase.auth.getSession();
        
        if (refreshError) {
          console.error('Session refresh failed:', refreshError);
          // Redirect to auth page if session refresh fails
          window.location.href = '/auth';
          return;
        }

        if (!session) {
          console.log('No valid session found, redirecting to auth...');
          window.location.href = '/auth';
          return;
        }
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      // Only log to database if it's not a network error and we have a user
      if (!(error instanceof TypeError && error.message === 'Failed to fetch') && user) {
        const browserInfo = {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language,
          url: window.location.href,
          timestamp: new Date().toISOString()
        };

        const { error: dbError } = await supabase
          .from('app_issues')
          .insert([
            {
              user_id: user.id,
              error_message: error.message,
              error_stack: error.stack,
              component_name: errorInfo.componentStack,
              route_path: window.location.pathname,
              browser_info: JSON.stringify(browserInfo),
            },
          ]);

        if (dbError) {
          console.error('Error saving issue:', dbError);
        }
      }
    } catch (err) {
      console.error('Error in error boundary:', err);
    }
  }

  handleRetry = async () => {
    console.log('Attempting retry...');
    this.setState(prev => ({ retryCount: prev.retryCount + 1 }));
    
    try {
      // Check session and refresh if needed
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session check failed:', sessionError);
        window.location.href = '/auth';
        return;
      }

      if (!session) {
        console.log('No valid session, redirecting to auth...');
        window.location.href = '/auth';
        return;
      }

      // If we have a valid session, reload the page
      window.location.reload();
    } catch (error) {
      console.error('Retry failed:', error);
      window.location.href = '/auth';
    }
  };

  handleGoBack = () => {
    window.history.back();
  };

  render() {
    if (this.state.hasError) {
      const isNetworkError = this.state.error instanceof TypeError && 
                            this.state.error.message === 'Failed to fetch';
      
      const isAuthError = this.state.error?.message.includes('auth/v1/user') ||
                         this.state.error?.message.includes('auth/v1/token');

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="w-full max-w-md space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>
                {isAuthError ? 'Authentication Error' : 
                 isNetworkError ? 'Connection Error' : 
                 'Something went wrong'}
              </AlertTitle>
              <AlertDescription className="mt-2">
                {isAuthError ? 'Please sign in again to continue.' :
                 isNetworkError ? 'Unable to connect to the server. Please check your internet connection and try again.' :
                 "We've encountered an unexpected error and our team has been notified."}
              </AlertDescription>
            </Alert>
            
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={this.handleGoBack}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
              <Button
                variant="default"
                onClick={this.handleRetry}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                {isAuthError ? 'Sign In' : 'Try Again'}
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;