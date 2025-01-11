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
} from 'recharts';
import { Users, MessageSquare, BookOpen, Activity } from 'lucide-react';

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

      // Get total thesis actions
      const { count: totalActions } = await supabase
        .from('thesis_versions')
        .select('*', { count: 'exact', head: true });

      return {
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalMessages: totalMessages || 0,
        totalActions: totalActions || 0,
        engagementRate: totalUsers ? Math.round((activeUsers / totalUsers) * 100) : 0
      };
    },
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  // Query for activity chart data
  const { data: activityData, isLoading: chartLoading } = useQuery({
    queryKey: ['activity-stats'],
    queryFn: async () => {
      console.log('Fetching activity statistics...');
      
      // Get messages per day
      const { data: messages, error: messagesError } = await supabase
        .from('chat_messages')
        .select('created_at')
        .order('created_at');

      if (messagesError) throw messagesError;

      // Get thesis actions per day
      const { data: thesisActions, error: thesisError } = await supabase
        .from('thesis_versions')
        .select('created_at')
        .order('created_at');

      if (thesisError) throw thesisError;

      // Get feedback submissions per day
      const { data: feedback, error: feedbackError } = await supabase
        .from('user_feedback')
        .select('created_at')
        .order('created_at');

      if (feedbackError) throw feedbackError;

      // Process data to get daily counts
      const processDataByDay = (data: any[]) => {
        return data.reduce((acc: {[key: string]: number}, item) => {
          const date = new Date(item.created_at).toISOString().split('T')[0];
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {});
      };

      const messagesByDay = processDataByDay(messages || []);
      const thesisByDay = processDataByDay(thesisActions || []);
      const feedbackByDay = processDataByDay(feedback || []);

      // Combine all dates
      const allDates = [...new Set([
        ...Object.keys(messagesByDay),
        ...Object.keys(thesisByDay),
        ...Object.keys(feedbackByDay),
      ])].sort();

      // Create final dataset
      const chartData = allDates.map(date => ({
        date,
        messages: messagesByDay[date] || 0,
        thesisActions: thesisByDay[date] || 0,
        feedback: feedbackByDay[date] || 0,
      }));

      return chartData;
    },
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  if (metricsLoading || chartLoading) {
    return <div>Loading activity data...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <div className="p-2 bg-orange-100 rounded-full">
              <BookOpen className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Engagement Rate</p>
              <h3 className="text-2xl font-bold">{metrics?.engagementRate}%</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Activity Chart */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">System Activity</h2>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={activityData}
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