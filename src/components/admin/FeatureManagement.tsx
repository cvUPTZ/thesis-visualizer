import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const FeatureManagement: React.FC = () => {
  const [trialDays, setTrialDays] = useState<number>(14);
  const { toast } = useToast();

  const handleUpdateTrialSettings = async (days: number): Promise<void> => {
    try {
      const { error } = await supabase
        .from('trial_settings')
        .update({ trial_days: days })
        .eq('id', 1);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Trial settings updated successfully",
      });
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
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          type="number"
          value={trialDays}
          onChange={(e) => setTrialDays(parseInt(e.target.value))}
          min={1}
          max={90}
          className="w-24"
        />
        <Button onClick={() => handleUpdateTrialSettings(trialDays)}>
          Update Trial Days
        </Button>
      </div>
    </div>
  );
};

export default FeatureManagement;