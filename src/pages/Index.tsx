import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Settings, Plus } from 'lucide-react';
import { ThesisList } from '@/components/thesis/ThesisList';
import { GettingStartedWizard } from '@/components/onboarding/GettingStartedWizard';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { UserProfile } from '@/components/dashboard/UserProfile';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { QuickTips } from '@/components/dashboard/QuickTips';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreateThesis = () => {
    navigate('/create-thesis');
    toast({
      title: "Starting New Thesis",
      description: "You're being redirected to create a new thesis.",
    });
  };

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-gray-100">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-center">
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
              onClick={() => navigate('/admin')} 
              variant="outline"
              className="bg-[#7E69AB]/10 hover:bg-[#7E69AB]/20 text-[#D6BCFA] border-[#D6BCFA]/20 font-sans"
            >
              <Settings className="w-4 h-4 mr-2" />
              Admin Panel
            </Button>
          </div>
        </div>

        {/* User Profile Section */}
        <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6 transition-all duration-200 hover:bg-white/10">
          <UserProfile 
            email="user@example.com"
            role="user"
          />
        </div>
        
        {/* Stats Grid */}
        <StatsGrid stats={{ total: 0, inProgress: 0, completed: 0 }} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Thesis Management */}
          <div className="space-y-6">
            <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif font-semibold text-[#D6BCFA]">
                  Thesis Management
                </h2>
                <Button
                  onClick={handleCreateThesis}
                  className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white font-sans"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Thesis
                </Button>
              </div>
              <Card className="bg-white/5 border-[#D6BCFA]/20">
                <ThesisList />
              </Card>
            </div>
          </div>

          {/* Right Column - Quick Tips and Getting Started */}
          <div className="space-y-6">
            <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
              <QuickTips />
            </div>
            <div className="backdrop-blur-xl bg-white/5 rounded-xl border border-white/10 p-6">
              <GettingStartedWizard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;