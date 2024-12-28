import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Eye, EyeOff, Save, LogOut } from 'lucide-react';
import { ThesisSaveButton } from './ThesisSaveButton';
import { Thesis } from '@/types/thesis';
import { generateThesisDocx } from '@/utils/docxExport';
import { Packer } from 'docx';
import { useToast } from '@/hooks/use-toast';
import { UserInfo } from './UserInfo';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { CollaboratorSection } from './toolbar/CollaboratorSection';

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
  const [userEmail, setUserEmail] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('email, role')
          .eq('id', user.id)
          .single();

        if (profile) {
          setUserEmail(profile.email);
          setUserRole(profile.role);
          setIsAdmin(profile.role === 'admin');
        }

        const { data: collaboratorData } = await supabase
          .from('thesis_collaborators')
          .select('role')
          .eq('thesis_id', thesisId)
          .eq('user_id', user.id)
          .single();

        setCurrentUserRole(collaboratorData?.role || null);
      }
    };

    fetchUserProfile();
  }, [thesisId]);

  useEffect(() => {
    const fetchCollaborators = async () => {
      try {
        const { data, error } = await supabase
          .from('thesis_collaborators')
          .select(`
            user_id,
            role,
            profiles (
              email,
              role
            )
          `)
          .eq('thesis_id', thesisId);

        if (error) {
          console.error('Error fetching collaborators:', error);
          return;
        }

        setCollaborators(data || []);
      } catch (error) {
        console.error('Error fetching collaborators:', error);
      }
    };

    if (thesisId) {
      fetchCollaborators();
    }
  }, [thesisId]);

  const handleExportDocx = async () => {
    try {
      const doc = generateThesisDocx(thesisData);
      const blob = await Packer.toBlob(doc);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${thesisData.frontMatter[0]?.title || 'thesis'}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Your thesis has been exported as a DOCX file.",
      });
    } catch (error) {
      console.error('Error exporting DOCX:', error);
      toast({
        title: "Error",
        description: "Failed to export thesis as DOCX. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    navigate('/auth');
  };

  const canManageCollaborators = isAdmin || currentUserRole === 'owner' || currentUserRole === 'admin';

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <ThesisSaveButton thesisId={thesisId} thesisData={thesisData} />
        <Button onClick={handleExportDocx} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export DOCX
        </Button>
        {userEmail && <UserInfo email={userEmail} role={userRole} />}
        <CollaboratorSection
          collaborators={collaborators}
          thesisId={thesisId}
          thesisTitle={thesisData.frontMatter[0]?.title || 'Untitled Thesis'}
          canManageCollaborators={canManageCollaborators}
          isAdmin={isAdmin}
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