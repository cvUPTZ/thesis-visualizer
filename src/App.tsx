// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import CreateThesis from "./pages/CreateThesis";
import { ThesisEditor } from "@/components/ThesisEditor";
import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./pages/AdminDashboard";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { NotificationProvider } from "@/contexts/NotificationContext"; // New Context

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }
     // if loading is false, you will redirect or return the components.
    return isAuthenticated ? children : <Navigate to="/auth" />;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, loading, userRole } = useAuth();

    if (loading) {
       return <div>Loading...</div>;
    }
      // if loading is false, you will redirect or return the components.
    if (!isAuthenticated) {
        return <Navigate to="/auth" />;
    }
     // if loading is false and the user is not an admin, redirect to /dashboard
    return userRole === 'admin' ? children : <Navigate to="/dashboard" />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
    <NotificationProvider>
        <AuthProvider>
          <Toaster />
            <BrowserRouter>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route
                  path="/dashboard"
                  element={
                  <ProtectedRoute>
                      <Index />
                  </ProtectedRoute>
                  }
                />
                <Route
                    path="/auth"
                    element={<Auth />}
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
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                   }
                />
              </Routes>
            </BrowserRouter>
        </AuthProvider>
      </NotificationProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;