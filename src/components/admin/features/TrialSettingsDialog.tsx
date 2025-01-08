import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TrialSettings {
  id: string;
  trial_days: string;
}

export function TrialSettingsDialog() {
  const [open, setOpen] = useState(false);
  const [settings, setSettings] = useState<TrialSettings | null>(null);
  const [trialDays, setTrialDays] = useState<number>(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from('trial_settings')
        .select('*')
        .single();

      if (error) {
        console.error('Error fetching trial settings:', error);
        return;
      }

      setSettings(data);
      setTrialDays(Number(data.trial_days));
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('trial_settings')
        .update({ trial_days: String(trialDays) })
        .eq('id', settings?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Trial settings updated successfully",
      });
      
      setOpen(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Trial Settings</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Trial Settings</DialogTitle>
          <DialogDescription>
            Configure the trial period settings for new users.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="trial-days" className="text-right">
                Trial Days
              </Label>
              <Input
                id="trial-days"
                type="number"
                value={trialDays}
                onChange={(e) => setTrialDays(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}