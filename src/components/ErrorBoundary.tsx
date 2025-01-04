import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  async componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const browserInfo = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
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
    } catch (err) {
      console.error('Error in error boundary:', err);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center p-8 rounded-lg border border-border">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <p className="text-muted-foreground mb-4">
              We've logged this error and our team will look into it.
            </p>
            <button
              className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
              onClick={() => window.location.reload()}
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;