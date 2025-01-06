import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Save, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface HeaderActionsProps {
  showPreview: boolean;
  onTogglePreview: () => void;
  onSaveToJson: () => void;
}

export const HeaderActions = ({
  showPreview,
  onTogglePreview,
  onSaveToJson,
}: HeaderActionsProps) => {
  const { handleLogout } = useAuth();
  const { toast } = useToast();

  const handleLogoutClick = async () => {
    try {
      console.log('🔄 Initiating logout from HeaderActions...');
      await handleLogout();
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
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={onTogglePreview}
        className="gap-2"
      >
        {showPreview ? (
          <>
            <EyeOff className="w-4 h-4" />
            Hide Preview
          </>
        ) : (
          <>
            <Eye className="w-4 h-4" />
            Show Preview
          </>
        )}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onSaveToJson}
        className="gap-2"
      >
        <Save className="w-4 h-4" />
        Save as JSON
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleLogoutClick}
        className="gap-2"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </Button>
    </div>
  );
};