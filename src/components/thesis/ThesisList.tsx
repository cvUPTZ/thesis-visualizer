import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ArrowDown, ArrowUp, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useThesesList } from '@/hooks/useThesesList';
import { ThesisListItem } from './ThesisListItem';
import { supabase } from '@/integrations/supabase/client';

export const ThesisList = () => {
  const [open, setOpen] = useState(false);
  const [loadingThesis, setLoadingThesis] = useState<string | null>(null);
  const { thesisList, isLoading, error, fetchTheses } = useThesesList();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLoadThesis = async (thesisId: string) => {
    try {
      console.log('📝 Loading thesis:', thesisId);
      setLoadingThesis(thesisId);
      
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.user) {
        console.error('❌ No authenticated user found');
        toast({
          title: "Authentication Error",
          description: "Please sign in to view this thesis",
          variant: "destructive",
        });
        return;
      }

      const { data: collaborator, error: collaboratorError } = await supabase
        .from('thesis_collaborators')
        .select('role')
        .eq('thesis_id', thesisId)
        .eq('user_id', session.session.user.id)
        .maybeSingle();

      if (collaboratorError) {
        console.error('❌ Error checking thesis access:', collaboratorError);
        toast({
          title: "Access Error",
          description: "You don't have permission to view this thesis",
          variant: "destructive",
        });
        return;
      }

      navigate(`/thesis/${thesisId}`);
      setOpen(false);
      toast({
        title: "Loading thesis",
        description: "Please wait while we load your thesis...",
      });
    } catch (error: any) {
      console.error('❌ Error loading thesis:', error);
      toast({
        title: "Error",
        description: "Failed to load thesis. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingThesis(null);
    }
  };

  // Only fetch theses when the popover is opened
  const handleToggleOpen = useCallback(() => {
    setOpen((prevOpen) => !prevOpen);
  }, []);

  // Only fetch theses once when the popover is opened
  useEffect(() => {
    if (open) {
      console.log('🔄 Fetching theses list...');
      fetchTheses();
    }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          onClick={handleToggleOpen}
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
          {error ? (
            <div className="text-center py-4">
              <p className="text-red-400 text-sm">{error}</p>
              <Button
                variant="ghost"
                onClick={fetchTheses}
                className="mt-2 text-gray-300 hover:text-white"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {thesisList.map((thesis) => (
                <ThesisListItem
                  key={thesis.id}
                  id={thesis.id}
                  title={thesis.title}
                  isLoading={loadingThesis === thesis.id}
                  onSelect={handleLoadThesis}
                />
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
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};