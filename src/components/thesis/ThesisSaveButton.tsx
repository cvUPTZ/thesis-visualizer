import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Thesis } from "@/types/thesis";
import { Save } from "lucide-react";
import { useState } from "react";

interface ThesisSaveButtonProps {
  thesisId: string;
  thesisData: Thesis;
}

export const ThesisSaveButton = ({ thesisId, thesisData }: ThesisSaveButtonProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      setIsSaving(true);
      console.log('Starting thesis save operation:', { thesisId, content: thesisData });
      
      const { data, error } = await supabase
        .from('theses')
        .update({ 
          content: thesisData,
          updated_at: new Date().toISOString()
        })
        .eq('id', thesisId)
        .select()
        .single();

      if (error) {
        console.error('Error saving thesis:', error);
        throw error;
      }

      console.log('Thesis saved successfully:', data);

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