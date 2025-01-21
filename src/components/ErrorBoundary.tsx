import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from './ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  async componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error);
    this.setState({ errorInfo });
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Only log to database if it's not a network error
      if (!(error instanceof TypeError && error.message === 'Failed to fetch')) {
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
              user_id: user?.id,
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

  handleRetry = () => {
    window.location.reload();
  };

  handleGoBack = () => {
    window.history.back();
  };

  render() {
    if (this.state.hasError) {
      const isNetworkError = this.state.error instanceof TypeError && 
                            this.state.error.message === 'Failed to fetch';

      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="w-full max-w-md space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>
                {isNetworkError ? 'Connection Error' : 'Something went wrong'}
              </AlertTitle>
              <AlertDescription className="mt-2">
                {isNetworkError 
                  ? 'Unable to connect to the server. Please check your internet connection and try again.'
                  : "We've encountered an unexpected error and our team has been notified."}
              </AlertDescription>
            </Alert>
            
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={this.handleGoBack}
                className="gap-2"
              >
                Go Back
              </Button>
              <Button
                variant="default"
                onClick={this.handleRetry}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
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