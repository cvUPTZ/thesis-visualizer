import { ThesisSaveButton } from "./ThesisSaveButton";
import { ThesisHeader } from "./ThesisHeader";
import { CollaboratorManager } from "../collaboration/CollaboratorManager";

interface ThesisToolbarProps {
  thesisId: string;
  thesisData: any;
  showPreview: boolean;
  onTogglePreview: () => void;
}

export const ThesisToolbar = ({ 
  thesisId, 
  thesisData,
  showPreview, 
  onTogglePreview 
}: ThesisToolbarProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <ThesisHeader 
          showPreview={showPreview} 
          onTogglePreview={onTogglePreview} 
        />
        <ThesisSaveButton thesisId={thesisId} thesisData={thesisData} />
      </div>
      <CollaboratorManager thesisId={thesisId} />
    </div>
  );
};