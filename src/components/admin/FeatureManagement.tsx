import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { TrialSettingsDialog } from './features/TrialSettingsDialog';

export const FeatureManagement: React.FC = () => {
  const [isTrialSettingsOpen, setIsTrialSettingsOpen] = useState(false);
  const [currentTrialDays, setCurrentTrialDays] = useState(30);
  const { toast } = useToast();

  const handleUpdateTrialSettings = async (days: number): Promise<void> => {
    try {
      const { error } = await supabase
        .from('trial_settings')
        .update({ trial_days: days })
        .eq('id', 'trialSettingsId');

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
    <div>
      <h2 className="text-lg font-semibold">Feature Management</h2>
      <Button onClick={() => setIsTrialSettingsOpen(true)}>Update Trial Settings</Button>
      <TrialSettingsDialog
        open={isTrialSettingsOpen}
        onOpenChange={setIsTrialSettingsOpen}
        currentTrialDays={currentTrialDays}
        onUpdate={handleUpdateTrialSettings}
      />
    </div>
  );
};