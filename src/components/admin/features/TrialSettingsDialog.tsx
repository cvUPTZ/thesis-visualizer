import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TrialSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTrialDays: number;
}

export const TrialSettingsDialog: React.FC<TrialSettingsDialogProps> = ({
  open,
  onOpenChange,
  currentTrialDays,
}) => {
  const { toast } = useToast();
  const [trialDays, setTrialDays] = React.useState(String(currentTrialDays));

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('trial_settings')
        .update({ trial_days: String(trialDays) })
        .eq('id', 1);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Trial settings updated successfully',
      });

      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
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
          <div>
            <label htmlFor="trialDays" className="text-sm font-medium">
              Trial Days
            </label>
            <Input
              id="trialDays"
              value={trialDays}
              onChange={(e) => setTrialDays(e.target.value)}
              type="number"
            />
          </div>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};