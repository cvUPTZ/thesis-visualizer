import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Settings, Users, FileText, AlertTriangle, Database } from 'lucide-react';
import { SystemStats } from '@/components/admin/SystemStats';
import { UserManagement } from '@/components/admin/UserManagement';
import { ThesisManagement } from '@/components/admin/ThesisManagement';
import { IssueManagement } from '@/components/admin/IssueManagement';
import { FeatureManagement } from '@/components/admin/FeatureManagement';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-gray-100">
      <div className="max-w-[1600px] mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="mb-4 text-[#D6BCFA] hover:text-[#B794F4] hover:bg-[#2D3748]/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-4xl font-serif font-bold text-[#D6BCFA]">
              Admin Panel
            </h1>
          </div>
          <Button 
            variant="outline" 
            className="gap-2 text-[#D6BCFA] hover:text-[#B794F4] border-[#D6BCFA]/20 hover:border-[#B794F4]/40"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>

        <SystemStats />

        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="mt-8"
        >
          <TabsList className="bg-[#2D3748] border-b border-[#4A5568]">
            <TabsTrigger 
              value="overview"
              className="data-[state=active]:bg-[#4A5568] data-[state=active]:text-[#D6BCFA]"
            >
              <Database className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="users"
              className="data-[state=active]:bg-[#4A5568] data-[state=active]:text-[#D6BCFA]"
            >
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger 
              value="theses"
              className="data-[state=active]:bg-[#4A5568] data-[state=active]:text-[#D6BCFA]"
            >
              <FileText className="w-4 h-4 mr-2" />
              Theses
            </TabsTrigger>
            <TabsTrigger 
              value="issues"
              className="data-[state=active]:bg-[#4A5568] data-[state=active]:text-[#D6BCFA]"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Issues
            </TabsTrigger>
            <TabsTrigger 
              value="features"
              className="data-[state=active]:bg-[#4A5568] data-[state=active]:text-[#D6BCFA]"
            >
              <Settings className="w-4 h-4 mr-2" />
              Features
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="overview" className="space-y-4">
              <div className="bg-white/5 rounded-xl border border-white/10 p-6">
                <h2 className="text-2xl font-serif font-semibold text-[#D6BCFA] mb-4">
                  System Overview
                </h2>
                <p className="text-gray-400">
                  Welcome to the admin dashboard. Monitor system health, manage users, and configure features.
                </p>
              </div>
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

            <TabsContent value="features">
              <FeatureManagement />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;