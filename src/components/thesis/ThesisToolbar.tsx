import { ThesisHeader } from "./ThesisHeader";
import { CollaboratorManager } from "../collaboration/CollaboratorManager";

interface ThesisToolbarProps {
  thesisId: string;
  thesisData: any;
  showPreview: boolean;
  onTogglePreview: () => void;
  isAdmin?: boolean;
}

export const ThesisToolbar = ({ 
  thesisId, 
  thesisData,
  showPreview, 
  onTogglePreview,
  isAdmin = false
}: ThesisToolbarProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <ThesisHeader 
          showPreview={showPreview} 
          onTogglePreview={onTogglePreview}
          thesisId={thesisId}
          thesisTitle={thesisData?.title || 'Untitled Thesis'}
          isAdmin={isAdmin}
          thesisData={thesisData}
        />
      </div>
      <CollaboratorManager 
        thesisId={thesisId} 
        thesisTitle={thesisData?.title || 'Untitled Thesis'} 
      />
    </div>
  );
};