import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserManagement } from '@/components/admin/UserManagement';
import { FeatureManagement } from '@/components/admin/FeatureManagement';
import { IssueManagement } from '@/components/admin/IssueManagement';
import { ThesisManagement } from '@/components/admin/ThesisManagement';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Settings, Users, Flag, BookOpen, LayoutDashboard, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminPanel = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isAuthenticated, userRole, loading } = useAuth();

  React.useEffect(() => {
    if (!loading && (!isAuthenticated || userRole !== 'admin')) {
      navigate('/auth');
    }
  }, [isAuthenticated, userRole, loading, navigate]);

  // Don't render anything while checking auth status
  if (loading || !isAuthenticated || userRole !== 'admin') {
    return null;
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <Button onClick={() => navigate('/')} variant="outline">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Back to Main
            </Button>
          </div>
          <Button onClick={handleLogout} variant="ghost" className="text-red-500 hover:text-red-700">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
        
        <Tabs defaultValue="users" className="w-full space-y-6">
          <TabsList className="grid w-full grid-cols-4 gap-4">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Features
            </TabsTrigger>
            <TabsTrigger value="issues" className="flex items-center gap-2">
              <Flag className="w-4 h-4" />
              Issues
            </TabsTrigger>
            <TabsTrigger value="theses" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Theses
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <UserManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle>Feature Management</CardTitle>
              </CardHeader>
              <CardContent>
                <FeatureManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="issues">
            <Card>
              <CardHeader>
                <CardTitle>Issue Management</CardTitle>
              </CardHeader>
              <CardContent>
                <IssueManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="theses">
            <Card>
              <CardHeader>
                <CardTitle>Thesis Management</CardTitle>
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