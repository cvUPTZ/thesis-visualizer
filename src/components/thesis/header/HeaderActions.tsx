import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

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
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error during logout:', error);
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
        onClick={handleLogout}
      >
        Logout
      </Button>
    </div>
  );
};