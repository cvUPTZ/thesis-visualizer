import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Download, Save } from "lucide-react";
import { CollaboratorSection } from "./toolbar/CollaboratorSection";
import { useCollaboratorPermissions } from "@/hooks/useCollaboratorPermissions";

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
  onTogglePreview,
}: ThesisToolbarProps) => {
  const { 
    collaborators, 
    canManageCollaborators,
    currentUserRole,
    loading 
  } = useCollaboratorPermissions(thesisId);

  if (loading) {
    return <div>Loading...</div>;
  }

  const isAdmin = currentUserRole === 'admin';

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onTogglePreview}
          className="gap-2"
        >
          {showPreview ? (
            <>
              <EyeOff className="w-4 h-4" />
              Hide Preview
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              Show Preview
            </>
          )}
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Save className="w-4 h-4" />
          Save
        </Button>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>
      <CollaboratorSection
        collaborators={collaborators}
        thesisId={thesisId}
        thesisTitle={thesisData.title}
        canManageCollaborators={canManageCollaborators}
        isAdmin={isAdmin}
      />
    </div>
  );
};