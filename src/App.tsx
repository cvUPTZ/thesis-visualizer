import React, { useEffect, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { NotificationProvider, useNotification } from "@/contexts/NotificationContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingScreen } from "@/components/ui/loading-screen";

// Lazy load components
const Index = React.lazy(() => import("./pages/Index"));
const Auth = React.lazy(() => import("./pages/Auth"));
const CreateThesis = React.lazy(() => import("./pages/CreateThesis"));
const ThesisEditor = React.lazy(() => import("@/components/ThesisEditor"));
const LandingPage = React.lazy(() => import("./pages/LandingPage"));
const AdminDashboard = React.lazy(() => import("./pages/AdminDashboard"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      suspense: true,
    },
  },
});

// Protected Route wrapper
const ProtectedRoute = ({ 
  requireAuth = true, 
  requireAdmin = false,
  children 
}: {
  requireAuth?: boolean;
  requireAdmin?: boolean;
  children: React.ReactNode;
}) => {
  const { isAuthenticated, loading, userRole } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen title="Loading..." />;
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (!requireAuth && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requireAdmin && userRole !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingScreen title="Loading..." />}>
      <Routes>
        <Route 
          path="/" 
          element={
            <ProtectedRoute requireAuth={false}>
              <LandingPage />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/auth"
          element={
            <ProtectedRoute requireAuth={false}>
              <Auth />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          }
        />
        <Route
          path="/thesis/:thesisId"
          element={
            <ProtectedRoute>
              <ThesisEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-thesis"
          element={
            <ProtectedRoute>
              <CreateThesis />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAuth requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

const GlobalErrorHandler = ({ children }: { children: React.ReactNode }) => {
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

  return <>{children}</>;
};

const AppContent = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <NotificationProvider>
            <AuthProvider>
              <GlobalErrorHandler>
                <AppRoutes />
                <Toaster />
              </GlobalErrorHandler>
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
      fallback={({ error, resetError }) => (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center p-6 rounded-lg shadow-lg bg-card">
            <h1 className="text-2xl font-bold mb-4 text-foreground">
              Something went wrong
            </h1>
            <p className="text-sm text-muted-foreground mb-4">
              {error?.message || "The application encountered an unexpected error."}
            </p>
            <button
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
              onClick={() => {
                resetError();
                window.location.reload();
              }}
            >
              Reload Application
            </button>
          </div>
        </div>
      )}
    >
      <AppContent />
    </ErrorBoundary>
  );
};

export default App;
