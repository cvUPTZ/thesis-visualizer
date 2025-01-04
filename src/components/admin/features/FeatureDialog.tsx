import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FeatureDialogProps {
  feature: {
    name: string;
    description: string | null;
    status: string;
    health: string;
    usage_data: Record<string, string | number>;
    is_sub_feature: boolean;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FeatureDialog = ({ feature, open, onOpenChange }: FeatureDialogProps) => {
  const formatUsageData = (data: Record<string, string | number> | null) => {
    if (!data) return null;
    return Object.entries(data).map(([key, value]) => (
      <div key={key} className="flex justify-between items-center py-1">
        <span className="text-sm font-medium capitalize">{key.replace(/_/g, ' ')}</span>
        <Badge variant="secondary">{value}</Badge>
      </div>
    ));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DialogTitle>{feature.name}</DialogTitle>
            {feature.is_sub_feature && (
              <Badge variant="outline">Sub-feature</Badge>
            )}
          </div>
          <DialogDescription>
            {feature.description || 'No description available'}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Status</h4>
              <Badge 
                variant={feature.status === 'Active' ? 'default' : 'secondary'}
              >
                {feature.status}
              </Badge>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Health</h4>
              <Badge 
                variant={feature.health === 'healthy' ? 'default' : 'destructive'}
              >
                {feature.health}
              </Badge>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Usage Statistics</h4>
              <div className="bg-muted rounded-lg p-3">
                {formatUsageData(feature.usage_data) || (
                  <p className="text-sm text-muted-foreground">No usage data available</p>
                )}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};