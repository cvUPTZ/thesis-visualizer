// File: src/components/thesis/ThesisList.tsx
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface ThesisListItem {
  id: string;
  title: string;
}

export const ThesisList = () => {
  const [thesisList, setThesisList] = useState<ThesisListItem[]>([]);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchTheses = async () => {
    try {
      const { data, error } = await supabase
        .from('theses')
        .select('id, title');

      if (error) {
        console.error('Error fetching theses', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load available theses",
          variant: "destructive",
        });
        return;
      }
      if (data) {
        setThesisList(data as ThesisListItem[]);
      }
    } catch (error: any) {
      console.error('Error fetching theses', error);
      toast({
        title: "Error",
        description: "Error fetching available theses",
        variant: "destructive",
      });
    }
  };

  const handleLoadThesis = async (thesisId: string) => {
    navigate(`/thesis/${thesisId}`);
  };

  const handleToggleOpen = useCallback(() => setOpen((prevOpen) => !prevOpen), []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          onClick={() => {
            fetchTheses();
            handleToggleOpen();
          }}
          className="gap-2"
        >
          {open ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
          Load Thesis
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <ScrollArea className="h-[200px] pr-4">
          <div className="space-y-2">
            {thesisList.map((thesis) => (
              <Button
                variant="ghost"
                key={thesis.id}
                className="w-full text-left"
                onClick={() => handleLoadThesis(thesis.id)}
              >
                {thesis.title}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};