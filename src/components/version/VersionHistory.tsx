import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ThesisVersion } from '@/types/thesis';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';

interface VersionHistoryProps {
  thesisId: string;
  onRestoreVersion: (version: ThesisVersion) => void;
}

export const VersionHistory = ({ thesisId, onRestoreVersion }: VersionHistoryProps) => {
  const [versions, setVersions] = useState<ThesisVersion[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchVersions = async () => {
      const { data, error } = await supabase
        .from('thesis_versions')
        .select(`
          *,
          profiles (
            email
          )
        `)
        .eq('thesis_id', thesisId)
        .order('version_number', { ascending: false });

      if (error) {
        console.error('Error fetching versions:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch version history',
          variant: 'destructive',
        });
        return;
      }

      setVersions(data);
    };

    fetchVersions();

    // Set up real-time subscription
    const channel = supabase
      .channel('thesis_versions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'thesis_versions',
          filter: `thesis_id=eq.${thesisId}`,
        },
        (payload) => {
          console.log('Real-time update:', payload);
          fetchVersions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [thesisId, toast]);

  const handleRestore = (version: ThesisVersion) => {
    onRestoreVersion(version);
    toast({
      title: 'Version Restored',
      description: `Restored to version ${version.version_number}`,
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5" />
          Version History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {versions.map((version) => (
              <Card key={version.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">Version {version.version_number}</h4>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(version.created_at), 'PPpp')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      By {(version as any).profiles?.email}
                    </p>
                    {version.description && (
                      <p className="mt-2 text-sm">{version.description}</p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRestore(version)}
                    className="ml-4"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Restore
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};