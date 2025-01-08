import React from 'react';
import { Card } from '@/components/ui/card';
import { Users, ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ThesisTracker } from '../tracker/ThesisTracker';
import { ThesisPlanning } from '../planning/ThesisPlanning';
import { CollaboratorPresence } from '@/components/collaboration/CollaboratorPresence';
import { Thesis } from '@/types/thesis';

interface ThesisEditorStatusProps {
  thesis: Thesis;
  thesisId: string;
  progress: number;
  showTracker: boolean;
  setShowTracker: (show: boolean) => void;
}

export const ThesisEditorStatus: React.FC<ThesisEditorStatusProps> = ({
  thesis,
  thesisId,
  progress,
  showTracker,
  setShowTracker
}) => {
  return (
    <div className="space-y-6">
      <Collapsible open={showTracker} onOpenChange={setShowTracker}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-primary" />
            <span className="text-sm text-muted-foreground">Auto-updating</span>
            <span className="text-sm font-medium">{progress}% Complete</span>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              {showTracker ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="space-y-4">
          <ThesisTracker thesis={thesis} />
          <ThesisPlanning thesis={thesis} />
        </CollapsibleContent>
      </Collapsible>
      
      <Card className="p-4 mb-4 bg-white/50 backdrop-blur-sm border border-primary/10">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="w-4 h-4" />
          <span className="font-medium">Active Collaborators</span>
        </div>
        <CollaboratorPresence thesisId={thesisId} />
      </Card>
    </div>
  );
};