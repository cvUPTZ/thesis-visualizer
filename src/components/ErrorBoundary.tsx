import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    
    // Log error to Supabase
    this.logError(error, errorInfo).catch(console.error);
  }

  private async logError(error: Error, errorInfo: React.ErrorInfo) {
    try {
      const { data: session } = await supabase.auth.getSession();
      const userId = session?.session?.user?.id;

      await (supabase.from('app_issues' as any) as any).insert({
        user_id: userId,
        error_message: error.message,
        component_name: errorInfo.componentStack?.slice(0, 500),
        browser_info: navigator.userAgent
      });
    } catch (err) {
      console.error('Failed to log error:', err);
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <Card className="max-w-lg w-full p-6 space-y-6">
            <div className="flex items-center gap-3 text-destructive">
              <AlertTriangle className="h-6 w-6" />
              <h2 className="text-xl font-semibold">Something went wrong</h2>
            </div>
            
            <p className="text-muted-foreground">
              An unexpected error occurred. Our team has been notified and we'll look into it.
            </p>

            {process.env.NODE_ENV === 'development' && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="font-mono text-sm break-all">
                  {this.state.error?.message}
                </p>
              </div>
            )}

            <Button 
              onClick={this.handleReset}
              className="w-full gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Reload Application
            </Button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}