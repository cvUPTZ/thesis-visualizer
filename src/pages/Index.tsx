import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      console.log('🔄 Initiating logout from Index page...');
      await logout();
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account.",
      });
      navigate('/auth');
    } catch (error) {
      console.error('❌ Error during logout:', error);
      toast({
        title: "Error signing out",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-4 right-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-card rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Welcome</h2>
            <p className="text-muted-foreground">
              This is your dashboard. Start creating and managing your content.
            </p>
          </div>
          <div className="bg-card rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
            <ul className="space-y-2">
              <li>Create new content</li>
              <li>View analytics</li>
              <li>Manage settings</li>
            </ul>
          </div>
          <div className="bg-card rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
            <p className="text-muted-foreground">No recent activity to display.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;