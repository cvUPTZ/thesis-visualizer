import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, UserPlus, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CollaboratorInviteForm } from '../collaboration/CollaboratorInviteForm';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { UserInfo } from './UserInfo';
import { CollaboratorsList } from './CollaboratorsList';

interface ThesisHeaderProps {
  showPreview: boolean;
  onTogglePreview: () => void;
  thesisId: string;
  thesisTitle: string;
  isAdmin?: boolean;
  thesisData: any;
}

interface Collaborator {
  user_id: string;
  role: string;
  profiles?: {
    email: string;
    role: string;
  };
}

export const ThesisHeader = ({ 
  showPreview, 
  onTogglePreview,
  thesisId,
  thesisTitle,
  isAdmin = false,
  thesisData
}: ThesisHeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userEmail, setUserEmail] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('email, role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }

        if (profile) {
          setUserEmail(profile.email);
          setUserRole(profile.role);
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

  const handleInviteSuccess = () => {
    toast({
      title: "Success",
      description: "Collaborator has been invited successfully.",
    });
  };

  const handleSaveToJson = () => {
    try {
      const jsonData = JSON.stringify(thesisData, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `thesis_${thesisId}_${new Date().toISOString()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Thesis saved as JSON file.",
      });
    } catch (error) {
      console.error('Error saving thesis to JSON:', error);
      toast({
        title: "Error",
        description: "Failed to save thesis as JSON file.",
        variant: "destructive",
      });
    }
  };

  const canManageCollaborators = isAdmin || currentUserRole === 'owner' || currentUserRole === 'admin';

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-serif">Thesis Editor</h1>
      <div className="flex items-center gap-4">
        {userEmail && <UserInfo email={userEmail} role={userRole} />}
        <CollaboratorsList collaborators={collaborators} thesisId={thesisId} />
        {canManageCollaborators && (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Add Collaborator
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <CollaboratorInviteForm
                thesisId={thesisId}
                thesisTitle={thesisTitle}
                onInviteSuccess={handleInviteSuccess}
                isAdmin={isAdmin}
              />
            </PopoverContent>
          </Popover>
        )}
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
        <Button
          variant="outline"
          size="sm"
          onClick={handleSaveToJson}
          className="gap-2"
        >
          <Save className="w-4 h-4" />
          Save as JSON
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};