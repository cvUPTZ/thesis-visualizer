import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowDown, ArrowUp, Loader2 } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const fetchTheses = async () => {
    try {
      console.log('📚 Fetching theses list...');
      setIsLoading(true);
      const { data, error } = await supabase
        .from('theses')
        .select('id, title');

      if (error) {
        console.error('❌ Error fetching theses:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load available theses",
          variant: "destructive",
        });
        return;
      }
      if (data) {
        console.log('✅ Theses loaded:', data);
        setThesisList(data as ThesisListItem[]);
      }
    } catch (error: any) {
      console.error('❌ Error fetching theses:', error);
      toast({
        title: "Error",
        description: "Error fetching available theses",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadThesis = async (thesisId: string) => {
    try {
      console.log('📝 Loading thesis:', thesisId);
      setIsLoading(true);
      navigate(`/thesis/${thesisId}`);
      setOpen(false);
      toast({
        title: "Loading thesis",
        description: "Please wait while we load your thesis...",
      });
    } catch (error) {
      console.error('❌ Error loading thesis:', error);
      toast({
        title: "Error",
        description: "Failed to load thesis",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
          className="gap-2 bg-transparent border-gray-700 text-white hover:bg-white/5 font-sans"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : open ? (
            <ArrowUp className="w-4 h-4" />
          ) : (
            <ArrowDown className="w-4 h-4" />
          )}
          Load Thesis
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-[#1A1F2C] border-gray-700">
        <ScrollArea className="h-[200px] pr-4">
          <div className="space-y-2">
            {thesisList.map((thesis) => (
              <Button
                variant="ghost"
                key={thesis.id}
                className="w-full text-left text-gray-300 hover:bg-white/5 hover:text-white font-sans"
                onClick={() => handleLoadThesis(thesis.id)}
                disabled={isLoading}
              >
                {thesis.title}
              </Button>
            ))}
            {thesisList.length === 0 && !isLoading && (
              <p className="text-center text-sm text-gray-400 py-4 font-sans">
                No theses found
              </p>
            )}
            {isLoading && (
              <div className="flex justify-center py-4">
                <Loader2 className="w-6 h-6 animate-spin text-[#9b87f5]" />
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};