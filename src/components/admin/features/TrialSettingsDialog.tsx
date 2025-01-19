import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TrialSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentTrialDays: number;
}

export const TrialSettingsDialog = ({
  open,
  onOpenChange,
  currentTrialDays,
}: TrialSettingsDialogProps) => {
  const [days, setDays] = React.useState(currentTrialDays);
  const { toast } = useToast();

  const handleSave = async () => {
    // Convert days to string when saving
    const { data, error } = await supabase
      .from('trial_settings')
      .update({ trial_days: days.toString() })
      .eq('id', 1)
      .select()
      .single();
      
    if (error) {
      toast({
        title: "Error",
        description: "Failed to update trial settings",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Success",
      description: "Trial settings updated successfully",
    });
    
    onOpenChange(false);
  };

  return (
    <div>
      <h2>Trial Settings</h2>
      <input
        type="number"
        value={days}
        onChange={(e) => setDays(Number(e.target.value))}
      />
      <Button onClick={handleSave}>Save</Button>
      <Button onClick={() => onOpenChange(false)}>Cancel</Button>
    </div>
  );
};
