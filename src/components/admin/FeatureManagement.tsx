import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Settings, AlertTriangle, CheckCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Feature {
  id: string;
  name: string;
  description: string | null;
  status: string;
  health: string;
  usage_data: any;
  last_updated: string;
}

export const FeatureManagement = () => {
  const { toast } = useToast();

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
      return data as Feature[];
    }
  });

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

  if (isLoading) {
    return <div>Loading features...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error loading features. Please try again later.
      </div>
    );
  }

  const formatUsageData = (usageData: any) => {
    if (!usageData) return 'N/A';
    if (typeof usageData === 'string') {
      try {
        usageData = JSON.parse(usageData);
      } catch (e) {
        return 'N/A';
      }
    }
    
    // Return the first numeric value found in usage_data
    const numericValue = Object.values(usageData).find(value => 
      typeof value === 'number' || 
      (typeof value === 'string' && value.includes('%'))
    );
    
    return numericValue?.toString() || 'N/A';
  };

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
            {features?.map((feature) => (
              <TableRow key={feature.id}>
                <TableCell className="font-medium">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="link" className="p-0">
                        {feature.name}
                      </Button>
                    </DialogTrigger>
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
                          <p className="flex items-center gap-2">
                            {getHealthIcon(feature.health)}
                            {feature.health}
                          </p>
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
                </TableCell>
                <TableCell>{getStatusBadge(feature.status)}</TableCell>
                <TableCell>{getHealthIcon(feature.health)}</TableCell>
                <TableCell>{formatUsageData(feature.usage_data)}</TableCell>
                <TableCell>{new Date(feature.last_updated).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleFeature(feature.id, feature.status)}
                  >
                    Toggle Status
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};