import React, { useState } from 'react';
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
import { AlertTriangle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';

interface FeaturePricingDialogProps {
  feature: {
    id: string;
    name: string;
    pricing_tier: string;
    trial_days?: number;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdatePricing: (featureId: string, pricingTier: string, trialDays?: number) => Promise<void>;
}

export const FeaturePricingDialog = ({ 
  feature, 
  open, 
  onOpenChange,
  onUpdatePricing 
}: FeaturePricingDialogProps) => {
  const [selectedTier, setSelectedTier] = useState(feature.pricing_tier);
  const [trialDays, setTrialDays] = useState<number>(feature.trial_days || 14);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      await onUpdatePricing(
        feature.id, 
        selectedTier, 
        selectedTier === 'trial' ? trialDays : undefined
      );
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
          {selectedTier !== feature.pricing_tier && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Changing pricing tier will affect all users' access to this feature.
                {selectedTier === 'paid' 
                  ? " Users will need to upgrade their subscription."
                  : " Feature will become available to all users."}
              </AlertDescription>
            </Alert>
          )}
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
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="trial" id="trial" />
              <Label htmlFor="trial">Trial</Label>
            </div>
          </RadioGroup>
          
          {selectedTier === 'trial' && (
            <div className="space-y-2">
              <Label htmlFor="trialDays">Trial Period (days)</Label>
              <Input
                id="trialDays"
                type="number"
                value={trialDays}
                onChange={(e) => setTrialDays(parseInt(e.target.value))}
                min={1}
                max={90}
              />
            </div>
          )}
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
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Updating...
              </>
            ) : (
              'Update'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};