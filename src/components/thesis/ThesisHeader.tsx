import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, User, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { CollaboratorInviteForm } from '../collaboration/CollaboratorInviteForm';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface ThesisHeaderProps {
  showPreview: boolean;
  onTogglePreview: () => void;
  thesisId: string;
  isAdmin?: boolean;
}

export const ThesisHeader = ({ 
  showPreview, 
  onTogglePreview,
  thesisId,
  isAdmin = false
}: ThesisHeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userEmail, setUserEmail] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');

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
      }
    };

    fetchUserProfile();
  }, []);

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

  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-serif">Thesis Editor</h1>
      <div className="flex items-center gap-4">
        {userEmail && (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="text-sm">{userEmail}</span>
            <Badge variant="secondary" className="text-xs">
              {userRole}
            </Badge>
          </div>
        )}
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
              onInviteSuccess={handleInviteSuccess}
              isAdmin={isAdmin}
            />
          </PopoverContent>
        </Popover>
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
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};