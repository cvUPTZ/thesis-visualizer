import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { TrialSettingsDialog } from './features/TrialSettingsDialog';

const FeatureManagement = () => {
  const [isTrialSettingsOpen, setIsTrialSettingsOpen] = useState(false);
  const [currentTrialDays, setCurrentTrialDays] = useState(30); // Default value
  const { toast } = useToast();

  const handleUpdateTrialSettings = async (days: number) => {
    const { data, error } = await supabase
      .from('trial_settings')
      .update({ trial_days: days })
      .eq('id', 'trialSettingsId') // Replace with actual trial settings ID
      .select()
      .single();

    if (error) throw error;
    return data;
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

export default FeatureManagement;
