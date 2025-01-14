import React, { useEffect, useState } from 'react';
import { useThesis } from '@/hooks/useThesis';
import { useThesisRealtime } from '@/hooks/useThesisRealtime';
import { ThesisSaveButton } from '@/components/thesis/ThesisSaveButton';

interface ThesisTrackerProps {
  thesisId: string;
}

export const ThesisTracker: React.FC<ThesisTrackerProps> = ({ thesisId }) => {
  const { thesis, loading, error } = useThesis(thesisId);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useThesisRealtime(thesisId, thesis, setLastUpdate);

  useEffect(() => {
    if (thesis) {
      setLastUpdate(thesis.updatedAt);
    }
  }, [thesis]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading thesis: {error.message}</div>;

  return (
    <div>
      <h2 className="text-lg font-bold">Thesis Tracker</h2>
      <p>Last updated: {lastUpdate ? lastUpdate.toLocaleString() : 'Never'}</p>
      <ThesisSaveButton thesisId={thesisId} thesisData={thesis} />
    </div>
  );
};