import React from 'react';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, ChevronRight, ChevronDown } from 'lucide-react';

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
  };
  subFeatures: any[];
  level?: number;
  onToggleFeature: (featureId: string, currentStatus: string) => Promise<void>;
  onOpenDialog: (feature: any) => void;
  expanded: boolean;
  onToggleExpand: () => void;
}

export const FeatureRow = ({
  feature,
  subFeatures,
  level = 0,
  onToggleFeature,
  onOpenDialog,
  expanded,
  onToggleExpand,
}: FeatureRowProps) => {
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
                className="p-0 h-6 w-6"
                onClick={onToggleExpand}
              >
                {expanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            )}
            <Button variant="link" className="p-0" onClick={() => onOpenDialog(feature)}>
              {feature.name}
            </Button>
          </div>
        </TableCell>
        <TableCell>{getStatusBadge(feature.status)}</TableCell>
        <TableCell>{getHealthIcon(feature.health)}</TableCell>
        <TableCell>{formatUsageData(feature.usage_data)}</TableCell>
        <TableCell>{new Date(feature.last_updated).toLocaleDateString()}</TableCell>
        <TableCell>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleFeature(feature.id, feature.status)}
          >
            Toggle Status
          </Button>
        </TableCell>
      </TableRow>
      {expanded && hasSubFeatures && subFeatures.map((subFeature) => (
        <FeatureRow
          key={subFeature.id}
          feature={subFeature}
          subFeatures={[]} // Sub-features can't have their own sub-features
          level={level + 1}
          onToggleFeature={onToggleFeature}
          onOpenDialog={onOpenDialog}
          expanded={false}
          onToggleExpand={() => {}}
        />
      ))}
    </>
  );
};

const formatUsageData = (usageData: any) => {
  if (!usageData) return 'N/A';
  if (typeof usageData === 'string') {
    try {
      usageData = JSON.parse(usageData);
    } catch (e) {
      return 'N/A';
    }
  }
  
  const numericValue = Object.values(usageData).find(value => 
    typeof value === 'number' || 
    (typeof value === 'string' && value.includes('%'))
  );
  
  return numericValue?.toString() || 'N/A';
};