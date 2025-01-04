import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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

export const FeatureManagement = () => {
  const [features, setFeatures] = useState([
    { 
      id: 1, 
      name: 'Collaborative Editing', 
      status: 'Active',
      description: 'Real-time collaborative editing features',
      health: 'healthy',
      lastUpdated: '2024-01-04',
      usage: '85%'
    },
    { 
      id: 2, 
      name: 'Real-time Comments', 
      status: 'In Development',
      description: 'Comment system with real-time updates',
      health: 'warning',
      lastUpdated: '2024-01-03',
      usage: 'N/A'
    },
    { 
      id: 3, 
      name: 'Export to PDF', 
      status: 'Active',
      description: 'Export thesis to PDF format',
      health: 'healthy',
      lastUpdated: '2024-01-02',
      usage: '92%'
    },
    { 
      id: 4, 
      name: 'AI Suggestions', 
      status: 'Beta',
      description: 'AI-powered writing suggestions',
      health: 'warning',
      lastUpdated: '2024-01-01',
      usage: '45%'
    },
  ]);

  const { toast } = useToast();

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

  const toggleFeature = (featureId: number) => {
    setFeatures(features.map(feature => {
      if (feature.id === featureId) {
        const newStatus = feature.status === 'Active' ? 'Inactive' : 'Active';
        return { ...feature, status: newStatus };
      }
      return feature;
    }));

    toast({
      title: 'Feature Updated',
      description: 'Feature status has been updated successfully',
    });
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
            {features.map((feature) => (
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
                          <h4 className="font-semibold">Usage</h4>
                          <p>{feature.usage}</p>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell>{getStatusBadge(feature.status)}</TableCell>
                <TableCell>{getHealthIcon(feature.health)}</TableCell>
                <TableCell>{feature.usage}</TableCell>
                <TableCell>{feature.lastUpdated}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleFeature(feature.id)}
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