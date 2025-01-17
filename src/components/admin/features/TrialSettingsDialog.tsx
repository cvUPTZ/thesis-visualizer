import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TrialSettingsDialogProps {
  settings: any;
  onClose: () => void;
}

const TrialSettingsDialog: React.FC<TrialSettingsDialogProps> = ({ settings, onClose }) => {
  const [trialDays, setTrialDays] = useState<string>(settings?.trial_days.toString() || '');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('trial_settings')
        .update({ trial_days: Number(trialDays) })
        .eq('id', settings?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Trial settings updated successfully",
      });
      onClose();
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
    <div className="p-4">
      <h2 className="text-lg font-semibold">Update Trial Settings</h2>
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
        <div className="flex justify-end">
          <Button type="button" onClick={onClose} variant="outline" className="mr-2">Cancel</Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </div>
  );
};

export default TrialSettingsDialog;
