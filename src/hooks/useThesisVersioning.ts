import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Thesis, ThesisVersion, ThesisContent } from '@/types/thesis';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface VersionDiff {
  path: string;
  type: 'addition' | 'deletion' | 'modification';
  oldValue?: any;
  newValue?: any;
}

const generateVersionDiff = (oldContent: ThesisContent, newContent: ThesisContent): VersionDiff[] => {
  const diff: VersionDiff[] = [];

  // Compare metadata
  Object.keys(newContent.metadata).forEach(key => {
    const oldValue = oldContent.metadata[key as keyof typeof oldContent.metadata];
    const newValue = newContent.metadata[key as keyof typeof newContent.metadata];
    
    if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
      diff.push({
        path: `metadata.${key}`,
        type: 'modification',
        oldValue,
        newValue
      });
    }
  });

  // Compare chapters
  newContent.chapters.forEach((chapter, index) => {
    const oldChapter = oldContent.chapters[index];
    if (!oldChapter) {
      diff.push({
        path: `chapters[${index}]`,
        type: 'addition',
        newValue: chapter
      });
      return;
    }

    if (chapter.title !== oldChapter.title) {
      diff.push({
        path: `chapters[${index}].title`,
        type: 'modification',
        oldValue: oldChapter.title,
        newValue: chapter.title
      });
    }

    // Compare chapter content
    chapter.content.forEach((content, contentIndex) => {
      const oldContent = oldChapter.content[contentIndex];
      if (!oldContent) {
        diff.push({
          path: `chapters[${index}].content[${contentIndex}]`,
          type: 'addition',
          newValue: content
        });
      } else if (JSON.stringify(content) !== JSON.stringify(oldContent)) {
        diff.push({
          path: `chapters[${index}].content[${contentIndex}]`,
          type: 'modification',
          oldValue: oldContent,
          newValue: content
        });
      }
    });
  });

  // Check for deleted chapters
  oldContent.chapters.forEach((chapter, index) => {
    if (!newContent.chapters[index]) {
      diff.push({
        path: `chapters[${index}]`,
        type: 'deletion',
        oldValue: chapter
      });
    }
  });

  return diff;
};

export const useThesisVersioning = (thesisId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch version history
  const {
    data: versions,
    isLoading: isLoadingVersions,
    error: versionsError
  } = useQuery({
    queryKey: ['thesis-versions', thesisId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('thesis_versions')
        .select('*')
        .eq('thesis_id', thesisId)
        .order('version_number', { ascending: false });

      if (error) throw error;
      return data as ThesisVersion[];
    }
  });

  // Create new version
  const createVersion = useMutation({
    mutationFn: async ({ 
      thesis, 
      description 
    }: { 
      thesis: Thesis; 
      description: string;
    }) => {
      const { data: latestVersion } = await supabase
        .from('thesis_versions')
        .select('version_number')
        .eq('thesis_id', thesisId)
        .order('version_number', { ascending: false })
        .limit(1)
        .single();

      const newVersionNumber = (latestVersion?.version_number || 0) + 1;

      // Get previous version for diff
      const { data: previousVersion } = await supabase
        .from('thesis_versions')
        .select('content')
        .eq('thesis_id', thesisId)
        .eq('version_number', newVersionNumber - 1)
        .single();

      const changes = previousVersion 
        ? generateVersionDiff(previousVersion.content, thesis.content)
        : [{ type: 'addition', path: 'root', description: 'Initial version' }];

      const { data, error } = await supabase
        .from('thesis_versions')
        .insert({
          thesis_id: thesisId,
          content: thesis.content,
          version_number: newVersionNumber,
          description,
          created_by: thesis.user_id,
          changes
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['thesis-versions', thesisId]);
      toast({
        title: 'Success',
        description: 'New version created successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to create version: ${error.message}`,
        variant: 'destructive',
      });
    }
  });

  // Restore version
  const restoreVersion = useMutation({
    mutationFn: async (versionNumber: number) => {
      const { data: version } = await supabase
        .from('thesis_versions')
        .select('content')
        .eq('thesis_id', thesisId)
        .eq('version_number', versionNumber)
        .single();

      if (!version) throw new Error('Version not found');

      const { error } = await supabase
        .from('theses')
        .update({ content: version.content })
        .eq('id', thesisId);

      if (error) throw error;

      return version;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['thesis', thesisId]);
      toast({
        title: 'Success',
        description: 'Version restored successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to restore version: ${error.message}`,
        variant: 'destructive',
      });
    }
  });

  // Compare versions
  const compareVersions = async (versionA: number, versionB: number) => {
    const { data: versions } = await supabase
      .from('thesis_versions')
      .select('content, version_number')
      .in('version_number', [versionA, versionB])
      .eq('thesis_id', thesisId);

    if (!versions || versions.length !== 2) {
      throw new Error('Could not find both versions for comparison');
    }

    const [oldVersion, newVersion] = versions.sort((a, b) => a.version_number - b.version_number);
    return generateVersionDiff(oldVersion.content, newVersion.content);
  };

  return {
    versions,
    isLoadingVersions,
    versionsError,
    createVersion,
    restoreVersion,
    compareVersions
  };
};
