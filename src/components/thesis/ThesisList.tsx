import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useNotification } from '@/contexts/NotificationContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

interface ThesisListItem {
  id: string;
  title: string;
}

export const ThesisList = () => {
  const { toast } = useNotification();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

   const { data: thesisList = [], isLoading, error } = useQuery({
        queryKey: ['thesis-list'],
      queryFn: async () => {
           try {
              const { data, error } = await supabase
                  .from('theses')
                  .select('id, title');
              if (error) {
                console.error('Error fetching theses', error);
                  throw new Error(error.message);
               }

               return data as ThesisListItem[];
           } catch (error: any) {
              console.error('Error fetching theses', error);
            toast({
                title: "Error",
                 description: "Error fetching available theses",
               variant: "destructive",
            });
               throw error;
           }
      }
   });

  const handleLoadThesis = async (thesisId: string) => {
    navigate(`/thesis/${thesisId}`);
  };

    const handleToggleOpen = useCallback(() => setOpen((prevOpen) => !prevOpen), []);

    if (isLoading) return <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#9b87f5] mx-auto my-auto"></div>;

   if (error) return <p className="text-red-500 mx-auto my-auto">Error Loading Thesis</p>
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          onClick={handleToggleOpen}
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