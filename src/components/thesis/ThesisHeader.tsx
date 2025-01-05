import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CollaboratorsList } from './CollaboratorsList';
import { UserSection } from './header/UserSection';
import { HeaderActions } from './header/HeaderActions';
import { Collaborator } from '@/types/collaborator';

interface ThesisHeaderProps {
  showPreview: boolean;
  onTogglePreview: () => void;
  thesisId: string;
  thesisTitle: string;
  isAdmin?: boolean;
  thesisData: any;
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
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate('/auth');
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select(`
            email,
            roles (
              name
            )
          `)
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          return;
        }

        if (profile) {
          setUserEmail(profile.email);
          setUserRole(profile.roles?.name || '');
        }

        const { data: collaboratorData } = await supabase
          .from('thesis_collaborators')
          .select('role')
          .eq('thesis_id', thesisId)
          .eq('user_id', session.user.id)
          .single();

        setCurrentUserRole(collaboratorData?.role || null);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [thesisId, navigate]);

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
              roles (
                name
              )
            )
          `)
          .eq('thesis_id', thesisId);

        if (error) {
          console.error('Error fetching collaborators:', error);
          return;
        }

        if (data) {
          setCollaborators(data as Collaborator[]);
        }
      } catch (error) {
        console.error('Error fetching collaborators:', error);
      }
    };

    if (thesisId) {
      fetchCollaborators();
    }
  }, [thesisId]);

  const handleLogout = async () => {
    try {
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
    } catch (error: any) {
      console.error('Error during logout:', error);
      toast({
        title: "Error signing out",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
      navigate('/auth');
    }
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

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-serif">Thesis Editor</h1>
      <div className="flex items-center gap-4">
        {userEmail && <UserSection userEmail={userEmail} userRole={userRole} />}
        <CollaboratorsList collaborators={collaborators} thesisId={thesisId} />
        <HeaderActions
          showPreview={showPreview}
          onTogglePreview={onTogglePreview}
          onSaveToJson={handleSaveToJson}
        />
      </div>
    </div>
  );
};
