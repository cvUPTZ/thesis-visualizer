import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TableDialogFooterProps {
  caption: string;
  onCaptionChange: (caption: string) => void;
  onCancel: () => void;
  onSave: () => void;
}

export const TableDialogFooter = ({
  caption,
  onCaptionChange,
  onCancel,
  onSave,
}: TableDialogFooterProps) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-1.5 block text-gray-700">
          Table Caption
        </label>
        <Input
          value={caption}
          onChange={(e) => onCaptionChange(e.target.value)}
          placeholder="Enter a descriptive caption for your table..."
          className="w-full"
        />
        <p className="text-xs text-muted-foreground mt-1">
          A good caption helps readers understand your table's content at a glance.
        </p>
      </div>
      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={onCancel}
          className="hover:bg-gray-50"
        >
          Cancel
        </Button>
        <Button 
          onClick={onSave}
          className="bg-primary hover:bg-primary/90"
        >
          Create Table
        </Button>
      </div>
    </div>
  );
};