import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import CreateThesis from "./pages/CreateThesis";
import { ThesisEditor } from "@/components/ThesisEditor";
import LandingPage from "./pages/LandingPage";
import AdminPanel from "./pages/AdminPanel";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public routes without loading state */}
              <Route path="/welcome" element={<LandingPage />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Protected routes with loading state */}
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route
                path="/thesis/:thesisId"
                element={<ProtectedRoute><ThesisEditor /></ProtectedRoute>}
              />
              <Route
                path="/create-thesis"
                element={<ProtectedRoute><CreateThesis /></ProtectedRoute>}
              />
              <Route
                path="/admin/*"
                element={<AdminRoute><AdminPanel /></AdminRoute>}
              />
            </Routes>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </ErrorBoundary>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading, userRole } = useAuth();
  console.log('🔒 Protected Route Check:', { isAuthenticated, loading, userRole });

  if (loading) {
    console.log('⌛ Loading protected route...');
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    console.log('🚫 User not authenticated, redirecting to /auth');
    return <Navigate to="/auth" />;
  }

  // Redirect admin users to admin panel
  if (userRole === 'admin') {
    console.log('👑 Admin user detected, redirecting to admin panel');
    return <Navigate to="/admin" />;
  }

  console.log('✅ Access granted to protected route');
  return children;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading, userRole } = useAuth();
  console.log('👑 Admin Route Check:', { isAuthenticated, loading, userRole });

  if (loading) {
    console.log('⌛ Loading admin route...');
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    console.log('🚫 User not authenticated, redirecting to /auth');
    return <Navigate to="/auth" />;
  }

  if (userRole !== 'admin') {
    console.log('⛔ Non-admin user, redirecting to home');
    return <Navigate to="/" />;
  }

  console.log('✅ Access granted to admin route');
  return children;
};

export default App;