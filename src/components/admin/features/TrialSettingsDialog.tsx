import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

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
  const [trialDays, setTrialDays] = useState<string>(String(currentTrialDays));
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    } catch (error) {
      console.error('Error updating trial settings:', error);
      toast({
        title: "Error",
        description: "Failed to update trial settings",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Trial Settings</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Trial Days</label>
            <Input
              type="number"
              value={trialDays}
              onChange={(e) => setTrialDays(e.target.value)}
              placeholder="Enter number of trial days"
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};