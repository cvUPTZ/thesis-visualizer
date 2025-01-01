import { Button } from "@/components/ui/button";
import { useNotification } from "@/contexts/NotificationContext";
import { Thesis } from "@/types/thesis";
import { Save } from "lucide-react";
import { useState } from "react";
import { thesisService } from "@/services/thesisService";


interface ThesisSaveButtonProps {
    thesisId: string;
    thesisData: Thesis;
}

export const ThesisSaveButton = ({ thesisId, thesisData }: ThesisSaveButtonProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useNotification();

  const handleSave = async () => {
    try {
      setIsSaving(true);
       console.log('Starting thesis save operation:', { thesisId, content: thesisData });
       await thesisService.updateThesis(thesisId, thesisData);

       toast({
          title: "Success",
            description: "Your thesis has been saved.",
        });

    } catch (error: any) {
       console.error('Error in save operation:', error);
         toast({
           title: "Error",
            description: error.message || "Failed to save thesis. Please try again.",
           variant: "destructive",
        });
    } finally {
      setIsSaving(false);
    }
  };

  return (
        <Button
            onClick={handleSave}
            disabled={isSaving}
            className="gap-2"
        >
          <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save'}
      </Button>
    );
};