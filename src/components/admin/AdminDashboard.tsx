import React from 'react';
import { SystemStats } from './SystemStats';
import { SystemTest } from '../testing/SystemTest';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, AlertTriangle } from 'lucide-react';

export const AdminDashboard = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs defaultValue="stats">
        <TabsList>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            System Stats
          </TabsTrigger>
          <TabsTrigger value="tests" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            System Tests
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="stats">
          <SystemStats />
        </TabsContent>
        
        <TabsContent value="tests">
          <SystemTest />
        </TabsContent>
      </Tabs>
    </div>
  );
};