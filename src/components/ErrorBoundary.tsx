import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, AlertDescription } from './ui/alert';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
      console.error('Error caught by ErrorBoundary', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
      if (this.state.hasError) {
          return (
              <div className="min-h-screen flex items-center justify-center p-8">
                  <Alert variant="destructive">
                    <AlertDescription>
                          <h2 className="text-xl font-semibold mb-2">Something went wrong.</h2>
                         {this.state.error?.message && <p>{this.state.error.message}</p>}
                         {process.env.NODE_ENV === "development" && (
                           <details style={{ whiteSpace: 'pre-wrap' }}>
                             <summary>Error Details</summary>
                             {this.state.errorInfo?.componentStack}
                            </details>
                           )}
                    </AlertDescription>
                  </Alert>
            </div>
          );
      }

      return this.props.children;
  }
}

export default ErrorBoundary;