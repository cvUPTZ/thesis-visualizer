import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ThesisHeaderProps {
  showPreview: boolean;
  onTogglePreview: () => void;
}

export const ThesisHeader = ({ showPreview, onTogglePreview }: ThesisHeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    navigate('/auth');
  };

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-serif">Thesis Editor</h1>
      <div className="flex gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onTogglePreview}
          className="gap-2"
        >
          {showPreview ? (
            <>
              <EyeOff className="w-4 h-4" />
              Hide Preview
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              Show Preview
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};