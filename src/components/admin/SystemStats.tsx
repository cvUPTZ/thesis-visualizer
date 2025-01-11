import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, AlertTriangle, Activity, Loader2, MessageSquare, MousePointer } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

export const SystemStats = () => {
  const { data: stats, isLoading, error, refetch } = useQuery({
    queryKey: ['system-stats'],
    queryFn: async () => {
      console.log('Fetching system statistics...');
      
      try {
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

        // Get total feedback count
        const { count: feedbackCount, error: feedbackError } = await supabase
          .from('user_feedback')
          .select('*', { count: 'exact', head: true });

        if (feedbackError) {
          console.error('Error fetching feedback count:', feedbackError);
          throw feedbackError;
        }

        // Get active sessions count
        const { count: activeSessionsCount, error: sessionsError } = await supabase
          .from('active_sessions')
          .select('*', { count: 'exact', head: true });

        if (sessionsError) {
          console.error('Error fetching sessions count:', sessionsError);
          throw sessionsError;
        }

        // Get total chat messages count
        const { count: messagesCount, error: messagesError } = await supabase
          .from('chat_messages')
          .select('*', { count: 'exact', head: true });

        if (messagesError) {
          console.error('Error fetching messages count:', messagesError);
          throw messagesError;
        }

        // Calculate system health (example metric: 100 - (issues/users * 100))
        const healthPercentage = usersCount 
          ? Math.max(0, Math.min(100, 100 - (issuesCount / usersCount * 100)))
          : 100;

        // Calculate engagement rate (messages per user)
        const engagementRate = usersCount 
          ? (messagesCount / usersCount).toFixed(1)
          : '0';

        console.log('System statistics fetched:', {
          usersCount,
          thesesCount,
          issuesCount,
          healthPercentage,
          activeSessionsCount,
          messagesCount,
          engagementRate
        });

        return {
          users: usersCount || 0,
          theses: thesesCount || 0,
          issues: issuesCount || 0,
          health: healthPercentage.toFixed(1),
          activeSessions: activeSessionsCount || 0,
          messages: messagesCount || 0,
          engagement: engagementRate,
          feedback: feedbackCount || 0
        };
      } catch (error) {
        console.error('Error fetching system stats:', error);
        throw error;
      }
    },
    refetchInterval: 30000, // Refresh every 30 seconds
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
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="mt-2"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const StatCard = ({ 
    title, 
    value, 
    description, 
    icon: Icon 
  }: { 
    title: string;
    value: string | number;
    description: string;
    icon: React.ElementType;
  }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
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
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Users"
        value={stats?.users || 0}
        description="Active system users"
        icon={Users}
      />
      <StatCard
        title="Active Sessions"
        value={stats?.activeSessions || 0}
        description="Currently active users"
        icon={MousePointer}
      />
      <StatCard
        title="Messages"
        value={stats?.messages || 0}
        description={`${stats?.engagement || 0} msgs/user`}
        icon={MessageSquare}
      />
      <StatCard
        title="System Health"
        value={`${stats?.health || 0}%`}
        description="Overall system status"
        icon={Activity}
      />
      <StatCard
        title="Total Theses"
        value={stats?.theses || 0}
        description="Total theses in system"
        icon={FileText}
      />
      <StatCard
        title="System Issues"
        value={stats?.issues || 0}
        description="Reported issues"
        icon={AlertTriangle}
      />
      <StatCard
        title="User Feedback"
        value={stats?.feedback || 0}
        description="Feedback submissions"
        icon={MessageSquare}
      />
      <StatCard
        title="Engagement Rate"
        value={`${stats?.engagement || 0}`}
        description="Messages per user"
        icon={Activity}
      />
    </div>
  );
};