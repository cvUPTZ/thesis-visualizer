import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Settings, Loader2, Plus, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FeatureDialog } from './features/FeatureDialog';
import { FeatureRow } from './features/FeatureRow';
import { FeaturePricingDialog } from './features/FeaturePricingDialog';
import { TrialSettingsDialog } from './features/TrialSettingsDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const FeatureManagement = () => {
  const { toast } = useToast();
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [selectedPricingFeature, setSelectedPricingFeature] = useState<any>(null);
  const [isTrialDialogOpen, setIsTrialDialogOpen] = useState(false);
  const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(new Set());

  const { data: features, isLoading: featuresLoading, error: featuresError, refetch: refetchFeatures } = useQuery({
    queryKey: ['features'],
    queryFn: async () => {
      console.log('Fetching features from Supabase...');
      const { data, error } = await supabase
        .from('features')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    }
  });

  const { data: trialSettings, isLoading: trialLoading, refetch: refetchTrial } = useQuery({
    queryKey: ['trial-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('trial_settings')
        .select('*')
        .single();

      if (error) throw error;
      return data;
    }
  });

  const toggleFeature = async (featureId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      const { error } = await supabase
        .from('features')
        .update({ 
          status: newStatus,
          last_updated: new Date().toISOString()
        })
        .eq('id', featureId);

      if (error) throw error;

      await refetchFeatures();
      
      toast({
        title: "Feature Updated",
        description: `Feature status has been updated to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating feature:', error);
      toast({
        title: "Error",
        description: "Failed to update feature status",
        variant: "destructive",
      });
    }
  };

  const updateFeaturePricing = async (featureId: string, pricingTier: string) => {
    try {
      const { error } = await supabase
        .from('features')
        .update({ 
          pricing_tier: pricingTier,
          last_updated: new Date().toISOString()
        })
        .eq('id', featureId);

      if (error) throw error;

      await refetchFeatures();
      
      toast({
        title: "Feature Updated",
        description: `Feature pricing tier has been updated to ${pricingTier}`,
      });
    } catch (error) {
      console.error('Error updating feature pricing:', error);
      toast({
        title: "Error",
        description: "Failed to update feature pricing",
        variant: "destructive",
      });
    }
  };

  const toggleExpand = (featureId: string) => {
    setExpandedFeatures(prev => {
      const next = new Set(prev);
      if (next.has(featureId)) {
        next.delete(featureId);
      } else {
        next.add(featureId);
      }
      return next;
    });
  };

  if (featuresLoading || trialLoading) {
    return (
      <Card className="w-full h-[400px] flex items-center justify-center">
        <CardContent className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (featuresError) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-destructive">Error Loading Features</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {featuresError instanceof Error ? featuresError.message : 'Failed to load features'}
          </p>
          <Button 
            onClick={() => refetchFeatures()} 
            variant="outline" 
            className="mt-4"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const organizedFeatures = features?.reduce((acc: any, feature: any) => {
    if (!feature.parent_id) {
      if (!acc.main) acc.main = [];
      acc.main.push(feature);
    } else {
      if (!acc.sub) acc.sub = {};
      if (!acc.sub[feature.parent_id]) acc.sub[feature.parent_id] = [];
      acc.sub[feature.parent_id].push(feature);
    }
    return acc;
  }, { main: [], sub: {} });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-admin-accent-tertiary">Feature Management</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2 text-admin-accent-primary hover:text-admin-accent-secondary border-admin-accent-primary/20 hover:border-admin-accent-secondary/40"
            onClick={() => setIsTrialDialogOpen(true)}
          >
            <Clock className="w-4 h-4" />
            Trial Settings ({trialSettings?.trial_days} days)
          </Button>
          <Button 
            variant="outline" 
            className="gap-2 text-admin-accent-primary hover:text-admin-accent-secondary border-admin-accent-primary/20 hover:border-admin-accent-secondary/40"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-admin-accent-secondary/30">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-admin-accent-tertiary">Feature Name</TableHead>
              <TableHead className="text-admin-accent-tertiary">Status</TableHead>
              <TableHead className="text-admin-accent-tertiary">Health</TableHead>
              <TableHead className="text-admin-accent-tertiary">Usage</TableHead>
              <TableHead className="text-admin-accent-tertiary">Last Updated</TableHead>
              <TableHead className="text-admin-accent-tertiary">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizedFeatures?.main.map((feature: any) => (
              <FeatureRow
                key={feature.id}
                feature={feature}
                subFeatures={organizedFeatures.sub[feature.id] || []}
                onToggleFeature={toggleFeature}
                onOpenDialog={setSelectedFeature}
                onOpenPricingDialog={setSelectedPricingFeature}
                expanded={expandedFeatures.has(feature.id)}
                onToggleExpand={() => toggleExpand(feature.id)}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedFeature && (
        <FeatureDialog
          feature={selectedFeature}
          open={!!selectedFeature}
          onOpenChange={(open) => !open && setSelectedFeature(null)}
        />
      )}

      {selectedPricingFeature && (
        <FeaturePricingDialog
          feature={selectedPricingFeature}
          open={!!selectedPricingFeature}
          onOpenChange={(open) => !open && setSelectedPricingFeature(null)}
          onUpdatePricing={updateFeaturePricing}
        />
      )}

      {isTrialDialogOpen && (
        <TrialSettingsDialog
          open={isTrialDialogOpen}
          onOpenChange={setIsTrialDialogOpen}
          currentTrialDays={trialSettings?.trial_days || 14}
          onUpdate={() => refetchTrial()}
        />
      )}
    </div>
  );
};