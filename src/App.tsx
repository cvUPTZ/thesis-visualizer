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
import { useToast } from "@/hooks/use-toast";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading, userRole } = useAuth();
  const { toast } = useToast();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  // Redirect admin users to admin panel
  if (userRole === 'admin') {
    return <Navigate to="/admin" />;
  }

  return children;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading, userRole } = useAuth();
  const { toast } = useToast();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  if (userRole !== 'admin') {
    toast({
      title: "Access Denied",
      description: "You need admin privileges to access this page",
      variant: "destructive"
    });
    return <Navigate to="/" />;
  }

  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/welcome" element={<LandingPage />} />
            <Route
              path="/thesis/:thesisId"
              element={<ProtectedRoute><ThesisEditor /></ProtectedRoute>}
            />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/create-thesis"
              element={<ProtectedRoute><CreateThesis /></ProtectedRoute>}
            />
            <Route
              path="/admin/*"
              element={<AdminRoute><AdminPanel /></AdminRoute>}
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;