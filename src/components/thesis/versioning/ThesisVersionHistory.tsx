import React, { useState } from 'react';
import { useThesisVersioning } from '@/hooks/useThesisVersioning';
import { ThesisVersion } from '@/types/thesis';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Loader2, Clock, ArrowDownUp, RotateCcw } from 'lucide-react';

interface ThesisVersionHistoryProps {
  thesisId: string;
  currentVersion: string;
}

export const ThesisVersionHistory: React.FC<ThesisVersionHistoryProps> = ({
  thesisId,
  currentVersion,
}) => {
  const {
    versions,
    isLoadingVersions,
    createVersion,
    restoreVersion,
    compareVersions,
  } = useThesisVersioning(thesisId);

  const [selectedVersions, setSelectedVersions] = useState<number[]>([]);
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<any[]>([]);
  const [isRestoring, setIsRestoring] = useState(false);

  const handleVersionSelect = (versionNumber: number) => {
    setSelectedVersions(prev => {
      if (prev.includes(versionNumber)) {
        return prev.filter(v => v !== versionNumber);
      }
      if (prev.length >= 2) {
        return [prev[1], versionNumber];
      }
      return [...prev, versionNumber];
    });
  };

  const handleCompare = async () => {
    if (selectedVersions.length !== 2) return;
    
    setIsComparing(true);
    try {
      const diff = await compareVersions(selectedVersions[0], selectedVersions[1]);
      setComparisonResult(diff);
    } catch (error) {
      console.error('Error comparing versions:', error);
    } finally {
      setIsComparing(false);
    }
  };

  const handleRestore = async (versionNumber: number) => {
    setIsRestoring(true);
    try {
      await restoreVersion.mutateAsync(versionNumber);
    } finally {
      setIsRestoring(false);
    }
  };

  const renderVersionItem = (version: ThesisVersion) => {
    const isSelected = selectedVersions.includes(version.version_number);
    const isCurrent = version.version === currentVersion;

    return (
      <div
        key={version.id}
        className={`p-4 rounded-lg ${
          isSelected ? 'bg-primary/10' : 'bg-card'
        } ${isCurrent ? 'border-2 border-primary' : 'border border-border'}`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">
              Version {version.version_number}
              {isCurrent && (
                <span className="ml-2 text-sm text-muted-foreground">
                  (Current)
                </span>
              )}
            </h3>
            <p className="text-sm text-muted-foreground">
              {format(new Date(version.created_at), 'PPpp')}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleVersionSelect(version.version_number)}
            >
              {isSelected ? 'Deselect' : 'Select'}
            </Button>
            {!isCurrent && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRestore(version.version_number)}
                disabled={isRestoring}
              >
                {isRestoring ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RotateCcw className="h-4 w-4" />
                )}
                <span className="ml-2">Restore</span>
              </Button>
            )}
          </div>
        </div>
        {version.description && (
          <p className="mt-2 text-sm">{version.description}</p>
        )}
        {version.changes && version.changes.length > 0 && (
          <div className="mt-2">
            <Separator className="my-2" />
            <details>
              <summary className="text-sm font-medium cursor-pointer">
                Changes ({version.changes.length})
              </summary>
              <ul className="mt-2 text-sm space-y-1">
                {version.changes.map((change, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        change.type === 'addition'
                          ? 'bg-green-500'
                          : change.type === 'deletion'
                          ? 'bg-red-500'
                          : 'bg-yellow-500'
                      }`}
                    />
                    <span>{change.path}</span>
                  </li>
                ))}
              </ul>
            </details>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Version History</h2>
        <div className="flex gap-2">
          {selectedVersions.length === 2 && (
            <Button
              variant="outline"
              onClick={handleCompare}
              disabled={isComparing}
            >
              {isComparing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowDownUp className="h-4 w-4" />
              )}
              <span className="ml-2">Compare Selected</span>
            </Button>
          )}
        </div>
      </div>

      {isLoadingVersions ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <ScrollArea className="h-[500px] rounded-md border">
          <div className="p-4 space-y-4">
            {versions?.map(renderVersionItem)}
          </div>
        </ScrollArea>
      )}

      {comparisonResult.length > 0 && (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Clock className="h-4 w-4 mr-2" />
              View Comparison
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Version Comparison</DialogTitle>
              <DialogDescription>
                Comparing Version {Math.min(...selectedVersions)} with Version{' '}
                {Math.max(...selectedVersions)}
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="h-[400px] mt-4">
              <div className="space-y-4">
                {comparisonResult.map((diff, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${
                      diff.type === 'addition'
                        ? 'bg-green-500/10 border-green-500/20'
                        : diff.type === 'deletion'
                        ? 'bg-red-500/10 border-red-500/20'
                        : 'bg-yellow-500/10 border-yellow-500/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          diff.type === 'addition'
                            ? 'bg-green-500'
                            : diff.type === 'deletion'
                            ? 'bg-red-500'
                            : 'bg-yellow-500'
                        }`}
                      />
                      <span className="font-medium">{diff.path}</span>
                    </div>
                    {diff.type === 'modification' && (
                      <div className="mt-2 space-y-2">
                        <div className="text-sm">
                          <span className="font-medium">Old:</span>
                          <pre className="mt-1 p-2 rounded bg-muted">
                            {JSON.stringify(diff.oldValue, null, 2)}
                          </pre>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">New:</span>
                          <pre className="mt-1 p-2 rounded bg-muted">
                            {JSON.stringify(diff.newValue, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
