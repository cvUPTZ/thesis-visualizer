import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, AlertTriangle, Activity, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

export const SystemStats = () => {
  const { data: stats, isLoading, error, refetch } = useQuery({
    queryKey: ['system-stats'],
    queryFn: async () => {
      // Get total users count
      const { count: usersCount, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (usersError) throw usersError;

      // Get total theses count
      const { count: thesesCount, error: thesesError } = await (supabase
        .from('theses' as any) as any)
        .select('*', { count: 'exact', head: true });

      if (thesesError) throw thesesError;

      // Get system issues count
      const { count: issuesCount, error: issuesError } = await (supabase
        .from('app_issues' as any) as any)
        .select('*', { count: 'exact', head: true });

      if (issuesError) throw issuesError;

      const healthPercentage = usersCount 
        ? Math.max(0, Math.min(100, 100 - ((issuesCount || 0) / usersCount * 100)))
        : 100;

      return {
        users: usersCount || 0,
        theses: thesesCount || 0,
        issues: issuesCount || 0,
        health: healthPercentage.toFixed(1)
      };
    },
    refetchInterval: 30000,
    retry: 3,
    staleTime: 10000,
  });

  if (error) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-full">
          <CardContent className="pt-6">
            <div className="text-center text-destructive">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
              <p>Error loading system statistics</p>
              <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-2">
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const StatCard = ({ title, value, description, icon: Icon }: { 
    title: string; value: string | number; description: string; icon: React.ElementType;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-muted">Loading...</span>
            </div>
          ) : value}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard title="Total Users" value={stats?.users || 0} description="Active system users" icon={Users} />
      <StatCard title="Total Theses" value={stats?.theses || 0} description="Total theses in system" icon={FileText} />
      <StatCard title="System Issues" value={stats?.issues || 0} description="Reported issues" icon={AlertTriangle} />
      <StatCard title="System Health" value={`${stats?.health || 0}%`} description="Overall system status" icon={Activity} />
    </div>
  );
};
