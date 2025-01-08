import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TrialSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTrialDays: number;
  onUpdate: () => void;
}

export const TrialSettingsDialog = ({
  open,
  onOpenChange,
  currentTrialDays,
  onUpdate
}: TrialSettingsDialogProps) => {
  const [trialDays, setTrialDays] = React.useState(currentTrialDays.toString());
  const [isUpdating, setIsUpdating] = React.useState(false);
  const { toast } = useToast();

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      const numericTrialDays = parseInt(trialDays, 10);
      
      if (isNaN(numericTrialDays) || numericTrialDays < 1) {
        throw new Error('Please enter a valid number of days');
      }

      const { error } = await supabase
        .from('trial_settings')
        .update({ trial_days: numericTrialDays })
        .eq('id', 1);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Trial period settings updated successfully",
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
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Trial Period Settings</DialogTitle>
          <DialogDescription>
            Set the number of days for the free trial period
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="trialDays">Trial Days</Label>
            <Input
              id="trialDays"
              type="number"
              value={trialDays}
              onChange={(e) => setTrialDays(e.target.value)}
              min={1}
              max={365}
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={isUpdating || parseInt(trialDays) === currentTrialDays}
          >
            {isUpdating ? 'Updating...' : 'Update'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};