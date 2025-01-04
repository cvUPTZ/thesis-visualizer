import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, LogOut } from "lucide-react";
import { ThesisList } from "@/components/thesis/ThesisList";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfile } from "@/components/dashboard/UserProfile";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { QuickTips } from "@/components/dashboard/QuickTips";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";

const LoadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        const newProgress = Math.min(oldProgress + Math.random() * 20, 90);
        return newProgress;
      });
    }, 500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      <Progress value={progress} className="w-full h-2" />
      <p className="text-sm text-muted-foreground text-center animate-pulse">
        Loading your personalized dashboard...
      </p>
    </div>
  );
};

const LoadingSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="min-h-screen bg-gray-50 p-8"
  >
    <div className="container mx-auto space-y-8">
      <LoadingProgress />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-lg p-6 shadow-lg"
          >
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="h-8 w-16 bg-gray-300 rounded animate-pulse" />
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-12 bg-gray-100 rounded animate-pulse"
              style={{
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  </motion.div>
);

const ErrorState = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
  <motion.div
    initial={{ scale: 0.9, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    className="min-h-screen bg-gray-50 p-8"
  >
    <div className="container mx-auto text-center max-w-md">
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="bg-white rounded-lg shadow-lg p-8 space-y-4"
      >
        <h2 className="text-2xl font-bold text-red-600">Error Loading Dashboard</h2>
        <p className="text-gray-600">{error}</p>
        <Button
          onClick={onRetry}
          className="mt-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          variant="default"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2"
          >
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Retry Loading
          </motion.div>
        </Button>
      </motion.div>
    </div>
  </motion.div>
);

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
    console.log('⌛ Index Page - Initial loading state');
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