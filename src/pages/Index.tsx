import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Settings, Plus, LogOut, Loader2 } from 'lucide-react';
import { ThesisList } from '@/components/thesis/ThesisList';
import { GettingStartedWizard } from '@/components/onboarding/GettingStartedWizard';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { ThesisProgressMap } from '@/components/dashboard/ThesisProgressMap';
import { UserProfile } from '@/components/dashboard/UserProfile';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { QuickTips } from '@/components/dashboard/QuickTips';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardData } from '@/hooks/useDashboardData';
import { motion, AnimatePresence } from 'framer-motion';

const Index = () => {
  console.log('📊 Dashboard page rendering');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { handleLogout, userId } = useAuth();
  const { userProfile, thesesStats, isLoading, error } = useDashboardData(userId);

  const handleCreateThesis = () => {
    navigate('/create-thesis');
    toast({
      title: "Starting New Thesis",
      description: "You're being redirected to create a new thesis.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1f2c] via-[#2d364d] to-[#1a1f2c] text-gray-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-lg font-medium text-primary/80">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a1f2c] via-[#2d364d] to-[#1a1f2c] text-gray-100 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-500/10 text-red-200 p-6 rounded-lg max-w-md text-center"
        >
          <p className="text-lg">Error loading dashboard: {error.message}</p>
          <Button 
            variant="outline" 
            className="mt-4 border-red-200/20 hover:bg-red-500/20"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  const isAdmin = userProfile?.roles?.name === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f2c] via-[#2d364d] to-[#1a1f2c] text-gray-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-full h-full">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white/5 rounded-full"
              style={{
                width: Math.random() * 300 + 50,
                height: Math.random() * 300 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8 relative z-10">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center"
        >
          <div className="space-y-1">
            <h1 className="text-4xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#9b87f5] to-[#D6BCFA]">
              Dashboard
            </h1>
            <p className="text-[#D6BCFA]/80 font-sans">
              Manage your thesis projects and track progress
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-400/20 font-sans transition-all duration-300"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
            {isAdmin && (
              <Button 
                onClick={() => navigate('/admin')} 
                variant="outline"
                className="bg-[#7E69AB]/10 hover:bg-[#7E69AB]/20 text-[#D6BCFA] border-[#D6BCFA]/20 font-sans transition-all duration-300"
              >
                <Settings className="w-4 h-4 mr-2" />
                Admin Panel
              </Button>
            )}
          </div>
        </motion.div>

        {/* User Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6 transition-all duration-300 hover:bg-white/10 hover:border-white/20"
        >
          <UserProfile 
            email={userProfile?.email || 'Loading...'}
            role={userProfile?.roles?.name || 'user'}
          />
        </motion.div>
        
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <StatsGrid stats={thesesStats || { total: 0, inProgress: 0, completed: 0 }} />
        </motion.div>

        {/* Thesis Progress Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <ThesisProgressMap stats={thesesStats || { total: 0, inProgress: 0, completed: 0 }} />
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Thesis Management */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-y-6"
          >
            <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6 transition-all duration-300 hover:bg-white/10 hover:border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif font-semibold text-[#D6BCFA]">
                  Thesis Management
                </h2>
                <Button
                  onClick={handleCreateThesis}
                  className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white font-sans transition-all duration-300 group"
                >
                  <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  Create New Thesis
                </Button>
              </div>
              <Card className="bg-white/5 border-[#D6BCFA]/20 transition-all duration-300 hover:bg-white/10">
                <ThesisList />
              </Card>
            </div>
          </motion.div>

          {/* Right Column - Quick Tips and Getting Started */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="space-y-6"
          >
            <AnimatePresence>
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6 transition-all duration-300 hover:bg-white/10 hover:border-white/20"
              >
                <QuickTips />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6 transition-all duration-300 hover:bg-white/10 hover:border-white/20"
              >
                <GettingStartedWizard />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;