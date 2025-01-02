import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, UserPlus, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useNotification } from '@/contexts/NotificationContext';
import { CollaboratorInviteForm } from '../collaboration/CollaboratorInviteForm';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { UserInfo } from './UserInfo';
import { CollaboratorsList } from './CollaboratorsList';
import { useUser } from '@/hooks/useUser';
import { thesisService } from '@/services/thesisService';

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
    const { toast } = useNotification();
    const { email, role, handleLogout } = useUser();
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
    const [isInviting, setIsInviting] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const profile = await thesisService.getUserProfile(user.id);

                if (profile) {
                    const { data: collaboratorData } = await supabase
                        .from('thesis_collaborators')
                        .select('role')
                        .eq('thesis_id', thesisId)
                        .eq('user_id', user.id)
                        .single();
                    setCurrentUserRole(collaboratorData?.role || null);
                }
            }
        };

        fetchUserProfile();
    }, [thesisId]);

    useEffect(() => {
        const fetchCollaborators = async () => {
            try {
                const data = await thesisService.fetchCollaborators(thesisId)
                setCollaborators(data);
            } catch (error) {
                console.error('Error fetching collaborators:', error);
            }
        };

        if (thesisId) {
            fetchCollaborators();
        }
    }, [thesisId]);

    const handleInviteSuccess = () => {
        toast({
            title: "Success",
            description: "Collaborator has been invited successfully.",
        });
    };

    const handleInviteError = (error: Error) => {
        toast({
            title: "Error",
            description: error.message || "Failed to invite collaborator. Please try again.",
            variant: "destructive",
        });
    };

    const handleSaveToJson = async () => {
        try {
            await thesisService.saveToJson(thesisData);
            toast({
                title: "Success",
                description: "Thesis saved as JSON file.",
            });
        } catch (error: any) {
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
                {email && <UserInfo email={email} role={role} />}
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
                                onInviteError={handleInviteError}
                                isAdmin={isAdmin}
                                setIsInviting={setIsInviting}
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
