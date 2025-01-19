import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FeatureDialog } from './features/FeatureDialog';
import { FeaturePricingDialog } from './features/FeaturePricingDialog';
import { TrialSettingsDialog } from './features/TrialSettingsDialog';
import { FeatureRow } from './features/FeatureRow';

interface Feature {
  id: string;
  name: string;
  description: string;
  status: string;
  health: string;
  pricing_tier: string;
  trial_days?: number;
  usage_data: any;
  last_updated: string;
  is_sub_feature: boolean;
  created_at: string;
  parent_id?: string;
}

const FeatureManagement: React.FC = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [isPricingDialogOpen, setIsPricingDialogOpen] = useState(false);
  const [isTrialDialogOpen, setIsTrialDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchFeatures();
  }, []);

  const fetchFeatures = async () => {
    try {
      const { data, error } = await supabase
        .from('features')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeatures(data || []);
    } catch (error) {
      console.error('Error fetching features:', error);
      toast({
        title: "Error",
        description: "Failed to load features",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureUpdate = async (feature: Feature) => {
    try {
      const { error } = await supabase
        .from('features')
        .update(feature)
        .eq('id', feature.id);

      if (error) throw error;

      setFeatures(features.map(f => 
        f.id === feature.id ? feature : f
      ));

      toast({
        title: "Success",
        description: "Feature updated successfully",
      });
    } catch (error) {
      console.error('Error updating feature:', error);
      toast({
        title: "Error",
        description: "Failed to update feature",
        variant: "destructive",
      });
    }
  };

  const handlePricingUpdate = async (featureId: string, pricingTier: string) => {
    try {
      const { error } = await supabase
        .from('features')
        .update({ pricing_tier: pricingTier })
        .eq('id', featureId);

      if (error) throw error;

      setFeatures(features.map(f => 
        f.id === featureId ? { ...f, pricing_tier: pricingTier } : f
      ));

      toast({
        title: "Success",
        description: "Pricing updated successfully",
      });
    } catch (error) {
      console.error('Error updating pricing:', error);
      toast({
        title: "Error",
        description: "Failed to update pricing",
        variant: "destructive",
      });
    }
  };

  const handleTrialUpdate = async (days: number) => {
    try {
      const { error } = await supabase
        .from('trial_settings')
        .update({ trial_days: days })
        .eq('id', selectedFeature?.id);

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
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Feature Management</h2>
        <div className="space-x-2">
          <FeatureDialog 
            feature={selectedFeature}
            open={!!selectedFeature}
            onOpenChange={(open) => !open && setSelectedFeature(null)}
          />
          <FeaturePricingDialog
            feature={selectedFeature!}
            open={isPricingDialogOpen}
            onOpenChange={setIsPricingDialogOpen}
            onUpdatePricing={handlePricingUpdate}
          />
          <TrialSettingsDialog
            open={isTrialDialogOpen}
            onOpenChange={setIsTrialDialogOpen}
            currentTrialDays={selectedFeature?.trial_days || 14}
            onUpdate={handleTrialUpdate}
          />
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div>Loading features...</div>
        ) : features.length === 0 ? (
          <div>No features found</div>
        ) : (
          features.map(feature => (
            <FeatureRow
              key={feature.id}
              feature={feature}
              subFeatures={[]}
              level={0}
              onToggleFeature={async (id, status) => {
                const newStatus = status === 'Active' ? 'Inactive' : 'Active';
                await handleFeatureUpdate({ ...feature, status: newStatus });
              }}
              onOpenDialog={setSelectedFeature}
              onOpenPricingDialog={(f) => {
                setSelectedFeature(f);
                setIsPricingDialogOpen(true);
              }}
              expanded={false}
              onToggleExpand={() => {}}
              onUpdate={handleFeatureUpdate}
            />
          ))
        )}
      </div>
    </Card>
  );
};

export default FeatureManagement;
