import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface FeaturePricingDialogProps {
  feature: {
    id: string;
    name: string;
    pricing_tier: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdatePricing: (featureId: string, pricingTier: string) => Promise<void>;
}

export const FeaturePricingDialog = ({ 
  feature, 
  open, 
  onOpenChange,
  onUpdatePricing 
}: FeaturePricingDialogProps) => {
  const [selectedTier, setSelectedTier] = React.useState(feature.pricing_tier);
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      await onUpdatePricing(feature.id, selectedTier);
      onOpenChange(false);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Feature Pricing</DialogTitle>
          <DialogDescription>
            Set the pricing tier for {feature.name}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <RadioGroup
            value={selectedTier}
            onValueChange={setSelectedTier}
            className="grid gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="free" id="free" />
              <Label htmlFor="free">Free Tier</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="paid" id="paid" />
              <Label htmlFor="paid">Paid Tier</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            disabled={isUpdating || selectedTier === feature.pricing_tier}
          >
            {isUpdating ? 'Updating...' : 'Update'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};