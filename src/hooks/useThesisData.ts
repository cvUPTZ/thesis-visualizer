import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNotification } from '@/contexts/NotificationContext';
import { validate as validateUUID } from 'uuid';
import { Thesis } from '@/types/thesis';
import { thesisService } from '@/services/thesisService';

export const useThesisData = (thesisId: string | undefined) => {
  const { toast } = useNotification();
  const queryClient = useQueryClient();

  const {
    data: thesis,
    isLoading,
    error,
  } = useQuery<Thesis | null, Error>({
    queryKey: ['thesis', thesisId],
        queryFn: async () => {
            if (!thesisId) {
               console.log('No thesis ID provided');
                return null;
            }

            if (!validateUUID(thesisId)) {
             console.error('Invalid thesis ID format:', thesisId);
               throw new Error('Invalid thesis ID format');
           }
            try {
              return await thesisService.getThesis(thesisId)
            } catch (err: any) {
              console.error("Error in useThesisData:", err);
             toast({
                   title: "Error",
                    description: "Failed to load thesis data. Please try again.",
                    variant: "destructive",
                });
              throw err;
           }
       },
    enabled: !!thesisId,
  });

    const setThesis = (newThesis: Thesis | ((prev: Thesis | null) => Thesis | null)) => {
       queryClient.setQueryData(['thesis', thesisId], newThesis);
  };

    return { thesis, setThesis, isLoading, error };
};