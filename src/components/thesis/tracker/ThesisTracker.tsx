import React from 'react';
import { ThesisSaveButton } from '@/components/thesis/ThesisSaveButton';
import { useToast } from '@/hooks/use-toast';
import { Thesis } from '@/types/thesis';

interface ThesisTrackerProps {
  thesisId: string;
  onSave?: (thesis: Thesis) => void;
}

export const ThesisTracker: React.FC<ThesisTrackerProps> = ({
  thesisId,
  onSave
}) => {
  const { toast } = useToast();

  const handleSave = async (thesis: Thesis) => {
    try {
      onSave?.(thesis);
      toast({
        title: "Success",
        description: "Thesis saved successfully",
      });
    } catch (error) {
      console.error('Error saving thesis:', error);
      toast({
        title: "Error",
        description: "Failed to save thesis",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-4">
      <ThesisSaveButton thesisId={thesisId} thesisData={null} />
    </div>
  );
};