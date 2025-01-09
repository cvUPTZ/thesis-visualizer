import React from 'react';
import { SystemStats } from './SystemStats';
import { SystemTest } from '../testing/SystemTest';
import { FeatureManagement } from './FeatureManagement';
import { UserManagement } from './UserManagement';
import { ThesisManagement } from './ThesisManagement';
import { IssueManagement } from './IssueManagement';
import { FeedbackManagement } from './feedback/FeedbackManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, AlertTriangle, Users, FileText, Bug, Settings, MessageSquare } from 'lucide-react';

export const AdminDashboard = () => {
  console.log('Rendering AdminDashboard');
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <SystemStats />
      
      <Tabs defaultValue="features" className="space-y-4">
        <TabsList className="grid grid-cols-7 w-full">
          <TabsTrigger value="features" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Features
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="theses" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Theses
          </TabsTrigger>
          <TabsTrigger value="issues" className="flex items-center gap-2">
            <Bug className="w-4 h-4" />
            Issues
          </TabsTrigger>
          <TabsTrigger value="tests" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            System Tests
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="feedback" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Feedback
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="features">
          <FeatureManagement />
        </TabsContent>
        
        <TabsContent value="users">
          <UserManagement />
        </TabsContent>
        
        <TabsContent value="theses">
          <ThesisManagement />
        </TabsContent>
        
        <TabsContent value="issues">
          <IssueManagement />
        </TabsContent>
        
        <TabsContent value="tests">
          <SystemTest />
        </TabsContent>
        
        <TabsContent value="activity">
          <ActivityLog />
        </TabsContent>

        <TabsContent value="feedback">
          <FeedbackManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// New ActivityLog component for system activity monitoring
const ActivityLog = () => {
  return (
    <div className="rounded-lg border p-6">
      <h2 className="text-2xl font-bold mb-4">System Activity</h2>
      <p className="text-muted-foreground">Activity monitoring coming soon...</p>
    </div>
  );
};