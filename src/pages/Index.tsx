import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Settings, Plus, BookOpen, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThesisList } from '@/components/thesis/ThesisList';
import { GettingStartedWizard } from '@/components/onboarding/GettingStartedWizard';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardStats {
  activeTheses: number;
  totalHours: number;
  collaborators: number;
  monthlyChange: number;
  weeklyHours: number;
  newCollaborators: number;
}

const Index = () => {
  const navigate = useNavigate();
  const { userRole, userId } = useAuth();
  
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboard-stats', userId],
    queryFn: async (): Promise<DashboardStats> => {
      console.log('📊 Fetching dashboard stats for user:', userId);
      
      if (!userId) {
        console.log('❌ No user ID available for fetching stats');
        throw new Error('User ID is required');
      }

      try {
        // Get active theses count
        const { count: thesesCount, error: thesesError } = await supabase
          .from('thesis_collaborators')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);

        if (thesesError) {
          console.error('❌ Error fetching theses count:', thesesError);
          throw thesesError;
        }

        console.log('✅ Theses count fetched:', thesesCount);

        // Get last month's theses count for comparison
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        
        const { count: lastMonthCount, error: lastMonthError } = await supabase
          .from('thesis_collaborators')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .lt('created_at', lastMonth.toISOString());

        if (lastMonthError) {
          console.error('❌ Error fetching last month count:', lastMonthError);
          throw lastMonthError;
        }

        console.log('✅ Last month count fetched:', lastMonthCount);

        // Get collaborator count
        const { data: collaborators, error: collaboratorsError } = await supabase
          .from('thesis_collaborators')
          .select('thesis_id')
          .eq('user_id', userId);

        if (collaboratorsError) {
          console.error('❌ Error fetching collaborators:', collaboratorsError);
          throw collaboratorsError;
        }

        // Get unique collaborators across all theses
        const uniqueCollaborators = new Set();
        for (const collab of collaborators || []) {
          const { data: thesisCollabs, error: collabError } = await supabase
            .from('thesis_collaborators')
            .select('user_id')
            .eq('thesis_id', collab.thesis_id)
            .neq('user_id', userId);

          if (collabError) {
            console.error('❌ Error fetching thesis collaborators:', collabError);
            throw collabError;
          }
          thesisCollabs?.forEach(tc => uniqueCollaborators.add(tc.user_id));
        }

        console.log('✅ Unique collaborators count:', uniqueCollaborators.size);

        // Calculate monthly change
        const monthlyChange = thesesCount ? thesesCount - (lastMonthCount || 0) : 0;

        const stats = {
          activeTheses: thesesCount || 0,
          totalHours: Math.floor(Math.random() * 100), // Placeholder for hours
          collaborators: uniqueCollaborators.size,
          monthlyChange,
          weeklyHours: Math.floor(Math.random() * 20), // Placeholder for weekly hours
          newCollaborators: Math.floor(Math.random() * 3) // Placeholder for new collaborators
        };

        console.log('✅ Dashboard stats compiled:', stats);
        return stats;
      } catch (error) {
        console.error('❌ Error in stats query:', error);
        throw error;
      }
    },
    retry: 1,
    staleTime: 30000, // Consider data fresh for 30 seconds
    enabled: !!userId,
  });

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

  const renderStatCard = (title: string, value: number | string | undefined, icon: React.ReactNode, subtitle?: string) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isLoading ? <Skeleton className="h-8 w-20" /> : value}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground">
            {isLoading ? <Skeleton className="h-4 w-24" /> : subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );

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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderStatCard(
          "Active Theses",
          stats?.activeTheses,
          <BookOpen className="h-4 w-4 text-muted-foreground" />,
          `${stats?.monthlyChange >= 0 ? '+' : ''}${stats?.monthlyChange || 0} since last month`
        )}
        {renderStatCard(
          "Hours Spent",
          stats?.totalHours,
          <Clock className="h-4 w-4 text-muted-foreground" />,
          `+${stats?.weeklyHours || 0} hours this week`
        )}
        {renderStatCard(
          "Collaborators",
          stats?.collaborators,
          <Users className="h-4 w-4 text-muted-foreground" />,
          `+${stats?.newCollaborators || 0} new collaborator`
        )}
      </div>

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