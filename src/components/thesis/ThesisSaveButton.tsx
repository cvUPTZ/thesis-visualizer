import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Save } from "lucide-react";
import { useState } from "react";

interface ThesisSaveButtonProps {
  thesisId: string;
  thesisData: any;
}

export const ThesisSaveButton = ({ thesisId, thesisData }: ThesisSaveButtonProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      setIsSaving(true);
      console.log('Saving thesis:', thesisId, thesisData);
      
      const { error } = await supabase
        .from('theses')
        .update({ 
          content: thesisData,
          updated_at: new Date().toISOString()
        })
        .eq('id', thesisId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your thesis has been saved.",
      });
    } catch (error) {
      console.error('Error saving thesis:', error);
      toast({
        title: "Error",
        description: "Failed to save thesis. Please try again.",
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