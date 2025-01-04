import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, AlertTriangle, Activity } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const SystemStats = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['system-stats'],
    queryFn: async () => {
      console.log('Fetching system statistics...');
      
      // Get total users count
      const { count: usersCount, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (usersError) {
        console.error('Error fetching users count:', usersError);
        throw usersError;
      }

      // Get total theses count
      const { count: thesesCount, error: thesesError } = await supabase
        .from('theses')
        .select('*', { count: 'exact', head: true });

      if (thesesError) {
        console.error('Error fetching theses count:', thesesError);
        throw thesesError;
      }

      // Get system issues count
      const { count: issuesCount, error: issuesError } = await supabase
        .from('app_issues')
        .select('*', { count: 'exact', head: true });

      if (issuesError) {
        console.error('Error fetching issues count:', issuesError);
        throw issuesError;
      }

      // Calculate system health (example metric: 100 - (issues/users * 100))
      const healthPercentage = usersCount 
        ? Math.max(0, Math.min(100, 100 - (issuesCount / usersCount * 100)))
        : 100;

      console.log('System statistics fetched:', {
        usersCount,
        thesesCount,
        issuesCount,
        healthPercentage
      });

      return {
        users: usersCount || 0,
        theses: thesesCount || 0,
        issues: issuesCount || 0,
        health: healthPercentage.toFixed(1)
      };
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? '...' : stats?.users || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            Active system users
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Theses</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? '...' : stats?.theses || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            Total theses in system
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">System Issues</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? '...' : stats?.issues || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            Reported issues
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">System Health</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isLoading ? '...' : `${stats?.health}%`}
          </div>
          <p className="text-xs text-muted-foreground">
            Overall system status
          </p>
        </CardContent>
      </Card>
    </div>
  );
};