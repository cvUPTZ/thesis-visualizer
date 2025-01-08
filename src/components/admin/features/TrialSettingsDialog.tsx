import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TrialSettings {
  id: string;
  trial_days: number;
  created_at: string;
  updated_at: string;
}

interface TrialSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTrialDays: number;
  onUpdate: () => Promise<any>;
}

export const TrialSettingsDialog: React.FC<TrialSettingsDialogProps> = ({
  open,
  onOpenChange,
  currentTrialDays,
  onUpdate,
}) => {
  const [trialDays, setTrialDays] = useState<number>(currentTrialDays);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Trial Settings</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="trialDays">Trial Period (days)</Label>
            <Input
              id="trialDays"
              type="number"
              value={trialDays}
              onChange={(e) => setTrialDays(parseInt(e.target.value))}
              min={1}
              max={90}
            />
          </div>
          <Button type="submit">Update Trial Settings</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};