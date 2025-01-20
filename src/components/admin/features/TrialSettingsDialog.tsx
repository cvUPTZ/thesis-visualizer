import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TrialSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings?: { id: string; trial_days: number };
}

export const TrialSettingsDialog: React.FC<TrialSettingsDialogProps> = ({ open, onOpenChange, settings }) => {
  const { toast } = useToast();
  const [trialDays, setTrialDays] = useState<number>(settings?.trial_days || 0);

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('trial_settings')
        .update({ trial_days: trialDays })
        .eq('id', settings?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Trial settings updated successfully",
      });
      
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
          <DialogTitle>Trial Settings</DialogTitle>
          <div className="space-y-4">
            <input
              type="number"
              value={trialDays}
              onChange={(e) => setTrialDays(Number(e.target.value))}
              placeholder="Trial Days"
              className="w-full"
            />
            <Button onClick={handleSave} className="w-full">
              Save
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
