import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Save } from 'lucide-react';

interface HeaderActionsProps {
  showPreview: boolean;
  onTogglePreview: () => void;
  onSaveToJson: () => void;
  onLogout: () => void;
}

export const HeaderActions = ({
  showPreview,
  onTogglePreview,
  onSaveToJson,
  onLogout,
}: HeaderActionsProps) => {
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
        onClick={onLogout}
      >
        Logout
      </Button>
    </div>
  );
};