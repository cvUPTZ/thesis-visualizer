// src/App.tsx
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import CreateThesis from "./pages/CreateThesis";
import { ThesisEditor } from "@/components/ThesisEditor";
import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./pages/AdminDashboard";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { NotificationProvider, useNotification } from "@/contexts/NotificationContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingScreen } from "@/components/ui/loading-screen";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const AppRoutes = () => {
  const { isAuthenticated, loading, userRole } = useAuth();
  const location = useLocation();

  // if (loading) {
  //   return <LoadingScreen title="Loading..." />;
  // }

  return (
    <Routes>
      <Route 
        path="/" 
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} 
      />
      <Route
        path="/auth"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Auth />}
      />
      <Route
        path="/dashboard"
        element={!isAuthenticated ? (
          <Navigate to="/auth" state={{ from: location }} replace />
        ) : (
          <Index />
        )}
      />
      <Route
        path="/thesis/:thesisId"
        element={!isAuthenticated ? (
          <Navigate to="/auth" state={{ from: location }} replace />
        ) : (
          <ThesisEditor />
        )}
      />
      <Route
        path="/create-thesis"
        element={!isAuthenticated ? (
          <Navigate to="/auth" state={{ from: location }} replace />
        ) : (
          <CreateThesis />
        )}
      />
      <Route
        path="/admin"
        element={
          !isAuthenticated ? (
            <Navigate to="/auth" state={{ from: location }} replace />
          ) : userRole !== 'admin' ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <AdminDashboard />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const AppContent = () => {
  const { toast } = useNotification();

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [toast]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <NotificationProvider>
            <AuthProvider>
              <AppRoutes />
              <Toaster />
            </AuthProvider>
          </NotificationProvider>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const App = () => {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center p-6 rounded-lg shadow-lg bg-card">
            <h1 className="text-2xl font-bold mb-4 text-foreground">
              Something went wrong
            </h1>
            <p className="text-sm text-muted-foreground mb-4">
              The application encountered an unexpected error.
            </p>
            <button
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
              onClick={() => window.location.reload()}
            >
              Reload Application
            </button>
          </div>
        </div>
      }
    >
      <AppContent />
    </ErrorBoundary>
  );
};

export default App;