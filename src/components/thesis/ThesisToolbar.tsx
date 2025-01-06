import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Eye, EyeOff, LogOut } from 'lucide-react';
import { ThesisSaveButton } from './ThesisSaveButton';
import { Thesis } from '@/types/thesis';
import { generateThesisDocx, generatePreviewDocx } from '@/utils/docxExport';
import { Packer } from 'docx';
import { useToast } from '@/hooks/use-toast';
import { UserInfo } from './UserInfo';
import { CollaboratorSection } from './toolbar/CollaboratorSection';
import { useUser } from '@/hooks/useUser';
import { useCollaboratorPermissions } from '@/hooks/useCollaboratorPermissions';
import { CollaboratorWithProfile } from '@/types/collaborator';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ThesisToolbarProps {
  thesisId: string;
  thesisData: Thesis;
  showPreview: boolean;
  onTogglePreview: () => void;
}

export const ThesisToolbar = ({
  thesisId,
  thesisData,
  showPreview,
  onTogglePreview,
}: ThesisToolbarProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { userEmail, userRole } = useUser();
  const {
    collaborators,
    canManageCollaborators,
    currentUserRole,
    userProfile,
    loading,
    error,
  } = useCollaboratorPermissions(thesisId);

  const handleLogout = async () => {
    try {
      console.log('🔄 Starting logout process...');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Error during sign out:', error);
        toast({
          title: "Error signing out",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Successfully signed out');
      toast({
        title: "Success",
        description: "You have been signed out successfully",
      });
      
      navigate('/auth');
    } catch (error: any) {
      console.error('❌ Unexpected error during logout:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while signing out",
        variant: "destructive",
      });
    }
  };

  const handleExport = async (type: 'academic' | 'preview') => {
    try {
      console.log(`Starting ${type} DOCX export with thesis data:`, thesisData);
      const doc = type === 'academic' 
        ? await generateThesisDocx(thesisData)
        : await generatePreviewDocx(thesisData);
      console.log('Document generated, converting to blob...');
      
      const blob = await Packer.toBlob(doc);
      console.log('Blob created, creating download link...');
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${thesisData.frontMatter[0]?.title || 'thesis'}_${type}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Your thesis has been exported as a DOCX file.",
      });
    } catch (error: any) {
      console.error('Error exporting DOCX:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to export thesis as DOCX. Please try again.",
        variant: "destructive",
      });
    }
  };

  const canManageCollaboratorsProp = currentUserRole === 'owner' || currentUserRole === 'admin' || userProfile?.roles?.name === 'admin';

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <ThesisSaveButton thesisId={thesisId} thesisData={thesisData} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleExport('academic')}>
              Academic Format
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('preview')}>
              Preview Format
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {userEmail && <UserInfo email={userEmail} role={userRole} />}
        <CollaboratorSection
          collaborators={collaborators as CollaboratorWithProfile[]}
          thesisId={thesisId}
          thesisTitle={thesisData.frontMatter[0]?.title || 'Untitled Thesis'}
          canManageCollaborators={canManageCollaboratorsProp}
          isAdmin={userProfile?.roles?.name === 'admin'}
        />
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={onTogglePreview} variant="outline" className="gap-2">
          {showPreview ? (
            <>
              <EyeOff className="h-4 w-4" />
              Hide Preview
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              Show Preview
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="gap-2"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};