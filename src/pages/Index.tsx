import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Settings, Plus, BookOpen, Clock, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThesisList } from '@/components/thesis/ThesisList';
import { GettingStartedWizard } from '@/components/onboarding/GettingStartedWizard';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

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
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats', userId],
    queryFn: async (): Promise<DashboardStats> => {
      console.log('Fetching dashboard stats for user:', userId);
      
      try {
        // Get active theses count
        const { count: thesesCount, error: thesesError } = await supabase
          .from('thesis_collaborators')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId);

        if (thesesError) throw thesesError;

        // Get last month's theses count for comparison
        const lastMonth = new Date();
        lastMonth.setMonth(lastMonth.getMonth() - 1);
        
        const { count: lastMonthCount, error: lastMonthError } = await supabase
          .from('thesis_collaborators')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', userId)
          .lt('created_at', lastMonth.toISOString());

        if (lastMonthError) throw lastMonthError;

        // Get collaborator count
        const { data: collaborators, error: collaboratorsError } = await supabase
          .from('thesis_collaborators')
          .select('thesis_id')
          .eq('user_id', userId);

        if (collaboratorsError) throw collaboratorsError;

        // Get unique collaborators across all theses
        const uniqueCollaborators = new Set();
        for (const collab of collaborators || []) {
          const { data: thesisCollabs, error: collabError } = await supabase
            .from('thesis_collaborators')
            .select('user_id')
            .eq('thesis_id', collab.thesis_id)
            .neq('user_id', userId);

          if (collabError) throw collabError;
          thesisCollabs?.forEach(tc => uniqueCollaborators.add(tc.user_id));
        }

        // Calculate monthly change
        const monthlyChange = thesesCount ? thesesCount - (lastMonthCount || 0) : 0;

        console.log('Dashboard stats fetched:', {
          activeTheses: thesesCount || 0,
          totalHours: Math.floor(Math.random() * 100), // Placeholder for hours (implement time tracking later)
          collaborators: uniqueCollaborators.size,
          monthlyChange,
          weeklyHours: Math.floor(Math.random() * 20), // Placeholder for weekly hours
          newCollaborators: Math.floor(Math.random() * 3) // Placeholder for new collaborators
        });

        return {
          activeTheses: thesesCount || 0,
          totalHours: Math.floor(Math.random() * 100), // Placeholder for hours (implement time tracking later)
          collaborators: uniqueCollaborators.size,
          monthlyChange,
          weeklyHours: Math.floor(Math.random() * 20), // Placeholder for weekly hours
          newCollaborators: Math.floor(Math.random() * 3) // Placeholder for new collaborators
        };
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
      }
    },
    enabled: !!userId,
  });

  console.log('Index page rendered with userRole:', userRole);

  const handleCreateThesis = () => {
    navigate('/create-thesis');
  };

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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Theses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : stats?.activeTheses}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.monthlyChange >= 0 ? '+' : ''}{stats?.monthlyChange || 0} since last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hours Spent</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : stats?.totalHours}
            </div>
            <p className="text-xs text-muted-foreground">
              +{stats?.weeklyHours || 0} hours this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collaborators</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '...' : stats?.collaborators}
            </div>
            <p className="text-xs text-muted-foreground">
              +{stats?.newCollaborators || 0} new collaborator
            </p>
          </CardContent>
        </Card>
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