import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TrialSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTrialDays: number;
}

export const TrialSettingsDialog: React.FC<TrialSettingsDialogProps> = ({
  open,
  onOpenChange,
  currentTrialDays
}) => {
  const [trialDays, setTrialDays] = useState(currentTrialDays.toString());
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
        description: "Trial days updated successfully",
      });
      
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
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
              min="1"
              className="mt-1"
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};