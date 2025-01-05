import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Settings, Plus } from 'lucide-react';
import { ThesisList } from '@/components/thesis/ThesisList';
import { GettingStartedWizard } from '@/components/onboarding/GettingStartedWizard';
import { StatsGrid } from '@/components/dashboard/StatsGrid';
import { UserProfile } from '@/components/dashboard/UserProfile';
import { useDashboardData } from '@/hooks/useDashboardData';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const navigate = useNavigate();
  const { userRole, userId } = useAuth();
  const { userProfile, thesesStats, isLoading, error } = useDashboardData(userId);

  const handleCreateThesis = () => {
    navigate('/create-thesis');
  };

  if (error) {
    console.error('❌ Error rendering dashboard:', error);
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-red-500">
          Error loading dashboard data. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {userRole === 'admin' && (
          <Button 
            onClick={() => navigate('/admin')} 
            variant="outline"
            className="flex items-center gap-2"
          >
            <Settings className="w-4 h-4" />
            Admin Panel
          </Button>
        )}
      </div>

      {isLoading ? (
        <Skeleton className="h-20 w-full" />
      ) : (
        <UserProfile 
          email={userProfile?.email || ''} 
          role={userProfile?.roles?.name || ''}
        />
      )}
      
      {isLoading ? (
        <Skeleton className="h-32 w-full" />
      ) : (
        <StatsGrid stats={thesesStats || { total: 0, inProgress: 0, completed: 0 }} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Thesis Management</h2>
            <div className="space-x-2">
              <Button
                onClick={handleCreateThesis}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Create New Thesis
              </Button>
              <ThesisList />
            </div>
          </div>
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground">
                Start writing your thesis or continue where you left off. You can create a new thesis
                or load an existing one.
              </p>
            </CardContent>
          </Card>
        </div>

        <div>
          <GettingStartedWizard />
        </div>
      </div>
    </div>
  );
};

export default Index;