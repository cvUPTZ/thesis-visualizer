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

export const FeatureManagement = () => {
  const [features] = useState([
    { id: 1, name: 'Collaborative Editing', status: 'Active' },
    { id: 2, name: 'Real-time Comments', status: 'In Development' },
    { id: 3, name: 'Export to PDF', status: 'Active' },
  ]);
  const { toast } = useToast();

  const toggleFeature = (featureId: number) => {
    toast({
      title: 'Feature Updated',
      description: 'Feature status has been updated successfully',
    });
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Feature Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {features.map((feature) => (
            <TableRow key={feature.id}>
              <TableCell>{feature.name}</TableCell>
              <TableCell>{feature.status}</TableCell>
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
  );
};