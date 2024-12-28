import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface ThesisHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
}

export const ThesisHeader = ({ title, onTitleChange }: ThesisHeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
      navigate("/auth");
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <Input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        className="text-2xl font-bold bg-transparent border-none focus-visible:ring-0 w-auto"
        placeholder="Untitled Thesis"
      />
      <Button variant="ghost" size="icon" onClick={handleLogout}>
        <LogOut className="h-5 w-5" />
      </Button>
    </div>
  );
};