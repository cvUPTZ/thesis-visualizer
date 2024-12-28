import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Collaborator {
  user_id: string;
  role: string;
  created_at: string;
  email?: string;
}

interface CollaboratorManagerProps {
  thesisId: string;
  isOwner: boolean;
}

export const CollaboratorManager = ({ thesisId, isOwner }: CollaboratorManagerProps) => {
  const [email, setEmail] = useState('');
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchCollaborators = async () => {
    const { data, error } = await supabase
      .from('thesis_collaborators')
      .select(`
        user_id,
        role,
        created_at,
        profiles:user_id (
          email
        )
      `)
      .eq('thesis_id', thesisId);

    if (error) {
      console.error('Error fetching collaborators:', error);
      return;
    }

    const formattedCollaborators = data.map(collab => ({
      ...collab,
      email: collab.profiles?.email
    }));

    setCollaborators(formattedCollaborators);
  };

  React.useEffect(() => {
    fetchCollaborators();
  }, [thesisId]);

  const handleInvite = async () => {
    if (!email) return;

    setLoading(true);
    try {
      // First, get the user ID from the email
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .single();

      if (profileError || !profiles) {
        toast({
          title: "User not found",
          description: "Please check the email address and try again.",
          variant: "destructive",
        });
        return;
      }

      // Add the collaborator
      const { error } = await supabase
        .from('thesis_collaborators')
        .insert({
          thesis_id: thesisId,
          user_id: profiles.id,
          role: 'editor'
        });

      if (error) {
        toast({
          title: "Error adding collaborator",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Collaborator added",
        description: "The user has been added as a collaborator.",
      });

      setEmail('');
      fetchCollaborators();
    } catch (error) {
      console.error('Error inviting collaborator:', error);
      toast({
        title: "Error",
        description: "An error occurred while adding the collaborator.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('thesis_collaborators')
        .delete()
        .eq('thesis_id', thesisId)
        .eq('user_id', userId);

      if (error) throw error;

      toast({
        title: "Collaborator removed",
        description: "The collaborator has been removed from the thesis.",
      });

      fetchCollaborators();
    } catch (error) {
      console.error('Error removing collaborator:', error);
      toast({
        title: "Error",
        description: "An error occurred while removing the collaborator.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="border-2 border-editor-border">
      <CardHeader>
        <CardTitle className="text-lg font-serif">Collaborators</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isOwner && (
          <div className="flex gap-2">
            <Input
              placeholder="Enter collaborator's email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
            <Button
              onClick={handleInvite}
              disabled={loading || !email}
              className="gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Invite
            </Button>
          </div>
        )}
        <div className="space-y-2">
          {collaborators.map((collaborator) => (
            <div
              key={collaborator.user_id}
              className="flex items-center justify-between p-2 bg-muted rounded-lg"
            >
              <div className="flex items-center gap-2">
                <span>{collaborator.email || collaborator.user_id}</span>
                <Badge variant="secondary">{collaborator.role}</Badge>
              </div>
              {isOwner && collaborator.role !== 'owner' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemove(collaborator.user_id)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};