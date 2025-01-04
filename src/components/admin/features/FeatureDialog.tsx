import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FeatureDialogProps {
  feature: {
    name: string;
    description: string | null;
    status: string;
    health: string;
    usage_data: any;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const FeatureDialog = ({ feature, open, onOpenChange }: FeatureDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{feature.name}</DialogTitle>
          <DialogDescription>
            {feature.description}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold">Status</h4>
            <p>{feature.status}</p>
          </div>
          <div>
            <h4 className="font-semibold">Health</h4>
            <p>{feature.health}</p>
          </div>
          <div>
            <h4 className="font-semibold">Usage Data</h4>
            <pre className="text-sm bg-gray-50 p-2 rounded">
              {JSON.stringify(feature.usage_data, null, 2)}
            </pre>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};