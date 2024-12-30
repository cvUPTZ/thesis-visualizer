// File: /src/pages/Index.tsx
import { Button } from "@/components/ui/button";
import { ThesisEditor } from "@/components/ThesisEditor";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { ThesisCreationModal } from "@/components/thesis/ThesisCreationModal";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ThesisListItem {
    id: string;
    title: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [thesisCreated, setThesisCreated] = useState(false);
  const [open, setOpen] = useState(false);
  const [thesisList, setThesisList] = useState<ThesisListItem[]>([]);
  const { toast } = useToast();

    const handleThesisCreated = (thesisId: string, title: string) => {
        setThesisCreated(true);
    };

    useEffect(() => {
        fetchTheses();
    }, []);


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
              setThesisList(data as ThesisListItem[])
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
        navigate(`/thesis/${thesisId}`)
   }

   const handleToggleOpen = useCallback( () => setOpen((prevOpen) => !prevOpen), [setOpen])


    return (
        <div className="flex flex-col h-full">
            <div className="flex justify-between p-4 items-center">
                <ThesisCreationModal onThesisCreated={handleThesisCreated}/>
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
            </div>
            <div className="flex-1">
                <ThesisEditor />
            </div>
        </div>
    );
};

export default Index;