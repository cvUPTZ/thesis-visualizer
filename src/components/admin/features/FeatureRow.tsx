import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, ChevronRight, ChevronDown, Loader2 } from 'lucide-react';

// Update the FeatureRowProps interface
interface FeatureRowProps {
  feature: {
    id: string;
    name: string;
    description: string | null;
    status: string;
    health: string;
    usage_data: any;
    last_updated: string;
    is_sub_feature: boolean;
    pricing_tier: string;
  };
  subFeatures: any[];
  level?: number;
  onToggleFeature: (featureId: string, currentStatus: string) => Promise<void>;
  onOpenDialog: (feature: any) => void;
  onOpenPricingDialog: (feature: any) => void;
  expanded: boolean;
  onToggleExpand: () => void;
}

export const FeatureRow = ({
  feature,
  subFeatures,
  level = 0,
  onToggleFeature,
  onOpenDialog,
  onOpenPricingDialog,
  expanded,
  onToggleExpand,
}: FeatureRowProps) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: string } = {
      'Active': 'bg-green-500',
      'In Development': 'bg-blue-500',
      'Beta': 'bg-yellow-500',
      'Inactive': 'bg-gray-500'
    };
    return (
      <Badge className={`${variants[status] || 'bg-gray-500'} text-white`}>
        {status}
      </Badge>
    );
  };

  const getHealthIcon = (health: string) => {
    if (health === 'healthy') {
      return <CheckCircle className="text-green-500 w-5 h-5" />;
    }
    return <AlertTriangle className="text-yellow-500 w-5 h-5" />;
  };

  const handleToggleFeature = async (featureId: string, currentStatus: string) => {
    try {
      setIsUpdating(true);
      await onToggleFeature(featureId, currentStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatUsageData = (usageData: any) => {
    if (!usageData) return 'N/A';
    
    const entries = Object.entries(usageData);
    for (const [key, value] of entries) {
      if (typeof value === 'number') {
        return value.toString();
      }
      if (typeof value === 'string' && value.includes('%')) {
        return value;
      }
    }
    
    return entries[0]?.[1]?.toString() || 'N/A';
  };

  const hasSubFeatures = subFeatures.length > 0;

  return (
    <>
      <TableRow className={level > 0 ? 'bg-gray-50' : ''}>
        <TableCell className="font-medium">
          <div className="flex items-center gap-2" style={{ paddingLeft: `${level * 20}px` }}>
            {hasSubFeatures && (
              <Button
                variant="ghost"
                size="sm"
                className="p-0 h-6 w-6 text-admin-accent-primary hover:text-admin-accent-secondary"
                onClick={onToggleExpand}
              >
                {expanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            )}
            <Button 
              variant="link" 
              className="p-0 text-admin-accent-primary hover:text-admin-accent-secondary transition-colors"
              onClick={() => onOpenDialog(feature)}
            >
              {feature.name}
            </Button>
          </div>
        </TableCell>
        <TableCell>{getStatusBadge(feature.status)}</TableCell>
        <TableCell>{getHealthIcon(feature.health)}</TableCell>
        <TableCell>{formatUsageData(feature.usage_data)}</TableCell>
        <TableCell>{new Date(feature.last_updated).toLocaleDateString()}</TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleToggleFeature(feature.id, feature.status)}
              disabled={isUpdating}
              className="text-admin-accent-primary hover:text-admin-accent-secondary border-admin-accent-primary/20 hover:border-admin-accent-secondary/40"
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Toggle Status
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenPricingDialog(feature)}
              className="text-admin-accent-primary hover:text-admin-accent-secondary border-admin-accent-primary/20 hover:border-admin-accent-secondary/40"
            >
              {feature.pricing_tier === 'paid' ? '💎 Paid' : '🆓 Free'}
            </Button>
          </div>
        </TableCell>
      </TableRow>
      {expanded && hasSubFeatures && subFeatures.map((subFeature) => (
        <FeatureRow
          key={subFeature.id}
          feature={subFeature}
          subFeatures={[]}
          level={level + 1}
          onToggleFeature={onToggleFeature}
          onOpenDialog={onOpenDialog}
          onOpenPricingDialog={onOpenPricingDialog}
          expanded={false}
          onToggleExpand={() => {}}
        />
      ))}
    </>
  );
};
