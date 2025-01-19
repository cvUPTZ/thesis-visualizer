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
  status: 'active' | 'inactive';
  health: 'healthy' | 'degraded' | 'down';
  pricing_tier: 'free' | 'premium' | 'enterprise';
  trial_days?: number;
}

const FeatureManagement: React.FC = () => {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Feature Management</h2>
        <div className="space-x-2">
          <FeatureDialog onFeatureAdded={fetchFeatures} />
          <FeaturePricingDialog />
          <TrialSettingsDialog />
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
              onUpdate={handleFeatureUpdate}
            />
          ))
        )}
      </div>
    </Card>
  );
};

export default FeatureManagement;