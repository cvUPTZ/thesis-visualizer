import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Settings, Plus, LogOut } from 'lucide-react';
import { ThesisList } from '@/components/thesis/ThesisList';
import { GettingStartedWizard } from '@/components/onboarding/GettingStartedWizard';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { UserProfile } from '@/components/dashboard/UserProfile';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { QuickTips } from '@/components/dashboard/QuickTips';

const Index = () => {
  const navigate = useNavigate();
  const { userRole, userId, logout } = useAuth();
  const { userProfile, thesesStats, isLoading, error } = useDashboardData(userId);
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      navigate('/auth');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Error logging out",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCreateThesis = () => {
    navigate('/create-thesis');
    toast({
      title: "Starting New Thesis",
      description: "You're being redirected to create a new thesis.",
    });
  };

  if (error) {
    console.error('❌ Error rendering dashboard:', error);
    toast({
      title: "Error Loading Dashboard",
      description: "There was a problem loading your dashboard data. Please try again.",
      variant: "destructive",
    });
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-red-500">
          Error loading dashboard data. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-violet-900">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h1 className="text-4xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-purple-400">
              Dashboard
            </h1>
            <p className="text-purple-200/80">
              Manage your thesis projects and track progress
            </p>
          </div>
          <div className="flex items-center gap-4">
            {userRole === 'admin' && (
              <Button 
                onClick={() => navigate('/admin')} 
                variant="outline"
                className="bg-white/10 hover:bg-white/20 text-purple-200 border-purple-200/20"
              >
                <Settings className="w-4 h-4 mr-2" />
                Admin Panel
              </Button>
            )}
            <Button 
              onClick={handleLogout}
              variant="ghost"
              className="text-red-300 hover:text-red-200 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {isLoading ? (
          <Skeleton className="h-20 w-full" />
        ) : (
          <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-purple-200/20 p-6 transition-all duration-200 hover:bg-white/10">
            <UserProfile 
              email={userProfile?.email || ''} 
              role={userProfile?.roles?.name || ''}
            />
          </div>
        )}
        
        {isLoading ? (
          <Skeleton className="h-32 w-full" />
        ) : (
          <StatsGrid stats={thesesStats || { total: 0, inProgress: 0, completed: 0 }} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-purple-200/20 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif font-semibold text-purple-200">
                  Thesis Management
                </h2>
                <Button
                  onClick={handleCreateThesis}
                  className="bg-purple-500 hover:bg-purple-600 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Thesis
                </Button>
              </div>
              <Card className="bg-white/5 border-purple-200/20">
                <ThesisList />
              </Card>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-purple-200/20 p-6">
              <QuickTips />
            </div>
            <div className="bg-white/5 backdrop-blur-lg rounded-xl border border-purple-200/20 p-6">
              <GettingStartedWizard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;