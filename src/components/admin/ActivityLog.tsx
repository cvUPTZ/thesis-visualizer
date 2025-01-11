import React from 'react';
import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { Users, MessageSquare, BookOpen, Activity, MousePointer, ScrollText } from 'lucide-react';

export const ActivityLog = () => {
  // Query for activity metrics
  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ['activity-metrics'],
    queryFn: async () => {
      console.log('Fetching activity metrics...');
      
      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get active users (users with activity in the last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { count: activeUsers } = await supabase
        .from('active_sessions')
        .select('*', { count: 'exact', head: true })
        .gt('last_seen', sevenDaysAgo.toISOString());

      // Get total messages
      const { count: totalMessages } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true });

      // Get total clicks
      const { count: totalClicks } = await supabase
        .from('user_interactions')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'click');

      // Get total page visits
      const { count: totalPageVisits } = await supabase
        .from('user_interactions')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'page_visit');

      // Get total scrolls
      const { count: totalScrolls } = await supabase
        .from('user_interactions')
        .select('*', { count: 'exact', head: true })
        .eq('event_type', 'scroll');

      return {
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalMessages: totalMessages || 0,
        totalClicks: totalClicks || 0,
        totalPageVisits: totalPageVisits || 0,
        totalScrolls: totalScrolls || 0,
        engagementRate: totalUsers ? Math.round((activeUsers / totalUsers) * 100) : 0
      };
    },
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  // Query for page visits data
  const { data: pageVisitsData } = useQuery({
    queryKey: ['page-visits'],
    queryFn: async () => {
      const { data } = await supabase
        .from('user_interactions')
        .select('page_path, count')
        .eq('event_type', 'page_visit')
        .select('page_path, created_at');

      // Process data to get visits per page
      const pageVisits = (data || []).reduce((acc: {[key: string]: number}, item) => {
        acc[item.page_path] = (acc[item.page_path] || 0) + 1;
        return acc;
      }, {});

      return Object.entries(pageVisits).map(([page, visits]) => ({
        page,
        visits
      }));
    }
  });

  // Query for click heatmap data
  const { data: clickData } = useQuery({
    queryKey: ['click-data'],
    queryFn: async () => {
      const { data } = await supabase
        .from('user_interactions')
        .select('x_position, y_position')
        .eq('event_type', 'click');

      return data || [];
    }
  });

  if (metricsLoading) {
    return <div>Loading activity data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <h3 className="text-2xl font-bold">{metrics?.totalUsers}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-green-100 rounded-full">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Users (7d)</p>
              <h3 className="text-2xl font-bold">{metrics?.activeUsers}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-purple-100 rounded-full">
              <MessageSquare className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Messages</p>
              <h3 className="text-2xl font-bold">{metrics?.totalMessages}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-yellow-100 rounded-full">
              <MousePointer className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Clicks</p>
              <h3 className="text-2xl font-bold">{metrics?.totalClicks}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-red-100 rounded-full">
              <ScrollText className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Scrolls</p>
              <h3 className="text-2xl font-bold">{metrics?.totalScrolls}</h3>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-orange-100 rounded-full">
              <BookOpen className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Page Visits</p>
              <h3 className="text-2xl font-bold">{metrics?.totalPageVisits}</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Page Visits Chart */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Page Visits</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pageVisitsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="page" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="visits" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Activity Chart */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">System Activity</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={[]} // Keep existing chart data
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="messages"
                stroke="#8884d8"
                name="Messages"
              />
              <Line
                type="monotone"
                dataKey="thesisActions"
                stroke="#82ca9d"
                name="Thesis Actions"
              />
              <Line
                type="monotone"
                dataKey="feedback"
                stroke="#ffc658"
                name="Feedback"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};