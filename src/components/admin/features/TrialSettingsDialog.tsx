import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TrialSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTrialDays: number;
  onSave: (days: number) => void;
}

export const TrialSettingsDialog: React.FC<TrialSettingsDialogProps> = ({
  open,
  onOpenChange,
  currentTrialDays,
  onSave
}) => {
  const [trialDays, setTrialDays] = React.useState(currentTrialDays);

  const handleSave = () => {
    onSave(trialDays);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Trial Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="trialDays">Trial Period (days)</Label>
            <Input
              id="trialDays"
              type="number"
              value={trialDays}
              onChange={(e) => setTrialDays(parseInt(e.target.value))}
              min={1}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};