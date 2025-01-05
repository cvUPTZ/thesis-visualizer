import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserManagement } from '@/components/admin/UserManagement';
import { FeatureManagement } from '@/components/admin/FeatureManagement';
import { IssueManagement } from '@/components/admin/IssueManagement';
import { ThesisManagement } from '@/components/admin/ThesisManagement';
import { SystemStats } from '@/components/admin/SystemStats';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Settings, Users, Flag, BookOpen, LayoutDashboard, LogOut } from 'lucide-react';

const AdminPanel = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, userRole, logout } = useAuth();

  if (!isAuthenticated || userRole !== 'admin') {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white">
      <div className="container mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#9b87f5] to-[#D6BCFA] bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => navigate('/')} 
              variant="outline"
              className="bg-[#2A2F3C]/50 border-[#7E69AB] text-[#D6BCFA] hover:bg-[#2A2F3C]/80"
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Back to Main
            </Button>
            <Button 
              onClick={logout} 
              variant="outline"
              className="bg-[#2A2F3C]/50 border-[#7E69AB] text-[#D6BCFA] hover:bg-[#2A2F3C]/80 gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>

        <div className="backdrop-blur-lg bg-[#2A2F3C]/30 rounded-lg p-4 border border-[#7E69AB]/30">
          <SystemStats />
        </div>
        
        <Tabs defaultValue="users" className="w-full space-y-6">
          <TabsList className="grid w-full grid-cols-4 gap-4 bg-[#2A2F3C]/50 p-1 rounded-lg">
            <TabsTrigger 
              value="users" 
              className="flex items-center gap-2 data-[state=active]:bg-[#7E69AB] data-[state=active]:text-white"
            >
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger 
              value="features" 
              className="flex items-center gap-2 data-[state=active]:bg-[#7E69AB] data-[state=active]:text-white"
            >
              <Settings className="w-4 h-4" />
              Features
            </TabsTrigger>
            <TabsTrigger 
              value="issues" 
              className="flex items-center gap-2 data-[state=active]:bg-[#7E69AB] data-[state=active]:text-white"
            >
              <Flag className="w-4 h-4" />
              Issues
            </TabsTrigger>
            <TabsTrigger 
              value="theses" 
              className="flex items-center gap-2 data-[state=active]:bg-[#7E69AB] data-[state=active]:text-white"
            >
              <BookOpen className="w-4 h-4" />
              Theses
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="backdrop-blur-lg bg-[#2A2F3C]/30 border-[#7E69AB]/30">
              <CardHeader>
                <CardTitle className="text-[#D6BCFA]">User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <UserManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features">
            <Card className="backdrop-blur-lg bg-[#2A2F3C]/30 border-[#7E69AB]/30">
              <CardHeader>
                <CardTitle className="text-[#D6BCFA]">Feature Management</CardTitle>
              </CardHeader>
              <CardContent>
                <FeatureManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="issues">
            <Card className="backdrop-blur-lg bg-[#2A2F3C]/30 border-[#7E69AB]/30">
              <CardHeader>
                <CardTitle className="text-[#D6BCFA]">Issue Management</CardTitle>
              </CardHeader>
              <CardContent>
                <IssueManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="theses">
            <Card className="backdrop-blur-lg bg-[#2A2F3C]/30 border-[#7E69AB]/30">
              <CardHeader>
                <CardTitle className="text-[#D6BCFA]">Thesis Management</CardTitle>
              </CardHeader>
              <CardContent>
                <ThesisManagement />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;