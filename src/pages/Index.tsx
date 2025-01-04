import React from 'react';
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
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const { userId, logout, loading: authLoading } = useAuth();
  const { thesesStats, isLoading: statsLoading, error: statsError } = useDashboardData(userId);
  const [userProfile, setUserProfile] = React.useState<any>(null);

  React.useEffect(() => {
    if (!userId) return;

    console.log('🔍 Fetching user profile for:', userId);
    supabase
      .from('profiles')
      .select(`
        *,
        roles (
          name
        )
      `)
      .eq('id', userId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          console.error('❌ Error fetching profile:', error);
          return;
        }
        console.log('✅ Profile fetched:', data);
        setUserProfile(data);
      });
  }, [userId]);

  console.log('📍 Index Page - Initial Render:', { 
    userId, 
    authLoading,
    statsLoading,
    userProfile
  });

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!authLoading && !userId) {
      console.log('🚫 Index Page - No active session, redirecting to welcome page');
      navigate('/welcome');
    }
  }, [userId, authLoading, navigate]);

  // Show loading skeleton only for initial auth check
  if (authLoading || !userId) {
    return <LoadingSkeleton />;
  }

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
            {userProfile ? (
              <UserProfile
                email={userProfile?.email}
                role={userProfile?.roles?.name || "User"}
              />
            ) : (
              <div className="h-12 w-48 bg-gray-200 animate-pulse rounded" />
            )}
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
            {statsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg" />
                ))}
              </div>
            ) : statsError ? (
              <ErrorState error={statsError} onRetry={() => window.location.reload()} />
            ) : (
              <StatsGrid stats={thesesStats} />
            )}
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