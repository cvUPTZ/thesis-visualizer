import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TrialSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTrialDays: number;
  onUpdate: () => void;
}

export const TrialSettingsDialog: React.FC<TrialSettingsDialogProps> = ({
  open,
  onOpenChange,
  currentTrialDays,
  onUpdate
}) => {
  const [trialDays, setTrialDays] = useState(String(currentTrialDays));
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('trial_settings')
        .update({ trial_days: parseInt(trialDays, 10) })
        .eq('id', 1);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Trial settings updated successfully",
      });
      onUpdate();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update trial settings",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Trial Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="trialDays">Trial Period (Days)</Label>
            <Input
              id="trialDays"
              type="number"
              value={trialDays}
              onChange={(e) => setTrialDays(e.target.value)}
              min="1"
              max="365"
            />
          </div>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};