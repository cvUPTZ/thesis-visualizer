import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ThesisCreationModal } from '@/components/thesis/ThesisCreationModal';
import { ThesisList } from '@/components/thesis/ThesisList';
import { UserProfile } from '@/components/dashboard/UserProfile';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { ThesisProgressMap } from '@/components/dashboard/ThesisProgressMap';
import { QuickTips } from '@/components/dashboard/QuickTips';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardData } from '@/hooks/useDashboardData';
import { motion } from 'framer-motion';

const Index = () => {
  console.log('📊 Dashboard page rendering');
  const navigate = useNavigate();
  const { toast } = useToast();
  const { handleLogout, userId } = useAuth();
  const { userProfile, thesesStats, isLoading, error } = useDashboardData(userId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1A1F2C] flex items-center justify-center">
        <p className="text-white">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1A1F2C] flex items-center justify-center">
        <p className="text-white">Error loading dashboard: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-serif font-bold text-[#D6BCFA]">
              Thesis Dashboard
            </h1>
            <p className="text-gray-400 mt-2">
              Welcome back, {userProfile?.full_name || 'Scholar'}
            </p>
          </div>
        </div>

        {/* User Profile Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6 transition-all duration-200 hover:bg-white/10"
        >
          <UserProfile 
            profile={userProfile}
            onLogout={handleLogout}
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

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-y-6"
          >
            <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-serif font-semibold text-[#D6BCFA]">
                  Thesis Management
                </h2>
                <Button
                  onClick={() => navigate('/create-thesis')}
                  className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white font-sans"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Thesis
                </Button>
              </div>
              <ThesisList />
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="space-y-6"
          >
            <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
              <QuickTips />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;