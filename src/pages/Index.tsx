import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, LogOut } from "lucide-react";
import { ThesisList } from "@/components/thesis/ThesisList";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfile } from "@/components/dashboard/UserProfile";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { QuickTips } from "@/components/dashboard/QuickTips";
import { useDashboardData } from "@/hooks/useDashboardData";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingSkeleton } from "@/components/loading/LoadingSkeleton";
import { ErrorState } from "@/components/error/ErrorState";

const Index = () => {
  const navigate = useNavigate();
  const { userId, logout, loading: authLoading } = useAuth();
  const { userProfile, thesesStats, isLoading, error } = useDashboardData(userId);
  const [retryCount, setRetryCount] = useState(0);

  console.log('📍 Index Page - Initial Render:', { 
    userId, 
    authLoading, 
    isLoading, 
    error,
    retryCount
  });

  useEffect(() => {
    if (!authLoading && !userId) {
      console.log('🚫 Index Page - No active session, redirecting to welcome page');
      navigate('/welcome');
    }
  }, [userId, authLoading, navigate]);

  const handleRetry = () => {
    console.log('🔄 Retrying dashboard load, attempt:', retryCount + 1);
    setRetryCount(prev => prev + 1);
    window.location.reload();
  };

  if (authLoading || !userId) {
    console.log('⌛ Index Page - Loading or no user:', { loading: authLoading, userId });
    return <LoadingSkeleton />;
  }

  if (error) {
    console.log('❌ Index Page - Error state:', error);
    return <ErrorState error={error} onRetry={handleRetry} />;
  }

  if (isLoading || !userProfile) {
    console.log('⌛ Index Page - Loading dashboard data');
    return <LoadingSkeleton />;
  }

  console.log('✅ Index Page - Render complete:', { 
    userProfile, 
    thesesStats,
    isAuthenticated: !!userId 
  });

  const handleLogout = async () => {
    console.log('🔄 Index Page - Initiating logout...');
    await logout();
    console.log('✅ Index Page - Logout complete');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="min-h-screen bg-gray-50"
      >
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex justify-between items-center mb-8"
          >
            <UserProfile
              email={userProfile?.email}
              role={userProfile?.roles?.name || "User"}
            />
            <Button
              onClick={handleLogout}
              variant="outline"
              className="gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </motion.div>

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <StatsGrid stats={thesesStats} />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-between mb-8"
          >
            <h2 className="text-2xl font-serif font-semibold text-primary">
              Your Theses
            </h2>
            <Button
              onClick={() => navigate("/create-thesis")}
              className="bg-primary hover:bg-primary-light text-white"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Start New Thesis
            </Button>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow"
          >
            <ThesisList />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <QuickTips />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Index;