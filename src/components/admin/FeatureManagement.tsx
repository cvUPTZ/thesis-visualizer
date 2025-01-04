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
import { Settings, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FeatureDialog } from './features/FeatureDialog';
import { FeatureRow } from './features/FeatureRow';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const FeatureManagement = () => {
  const { toast } = useToast();
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [expandedFeatures, setExpandedFeatures] = useState<Set<string>>(new Set());

  const { data: features, isLoading, error, refetch } = useQuery({
    queryKey: ['features'],
    queryFn: async () => {
      console.log('Fetching features from Supabase...');
      const { data, error } = await supabase
        .from('features')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching features:', error);
        throw error;
      }

      console.log('Features fetched:', data);
      return data;
    }
  });

  const toggleFeature = async (featureId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      const { error } = await supabase
        .from('features')
        .update({ status: newStatus })
        .eq('id', featureId);

      if (error) throw error;

      await refetch();
      
      toast({
        title: "Feature Updated",
        description: "Feature status has been updated successfully",
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

  if (isLoading) {
    return (
      <Card className="w-full h-[400px] flex items-center justify-center">
        <CardContent className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading features...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-destructive">Error Loading Features</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {error instanceof Error ? error.message : 'Failed to load features. Please try again.'}
          </p>
          <Button 
            onClick={() => refetch()} 
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

  if (!features?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Features Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No features have been added yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Feature Management</h2>
        <Button variant="outline" className="gap-2">
          <Settings className="w-4 h-4" />
          Settings
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Feature Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Health</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Actions</TableHead>
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
    </div>
  );
};