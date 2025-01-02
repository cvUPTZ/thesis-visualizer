import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Eye, EyeOff, LogOut } from 'lucide-react';
import { ThesisSaveButton } from './ThesisSaveButton';
import { Thesis } from '@/types/thesis';
import { useNotification } from '@/contexts/NotificationContext';
import { UserInfo } from './UserInfo';
import { CollaboratorSection } from './toolbar/CollaboratorSection';
import { useUser } from '@/hooks/useUser';
import { useCollaboratorPermissions } from '@/hooks/useCollaboratorPermissions';
import { CollaboratorWithProfile } from '@/types/collaborator';
import { thesisService } from '@/services/thesisService';
import { ReviewerManager } from './review/ReviewerManager';
import { supabase } from '@/integrations/supabase/client';

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
    const { toast } = useNotification();
    const { email, role, handleLogout } = useUser();
    const {
        collaborators,
        canManageCollaborators,
        currentUserRole,
        userProfile,
        loading,
        error,
    } = useCollaboratorPermissions(thesisId);

    const handleExportDocx = async () => {
        try {
            console.log('Starting DOCX export with thesis data:', thesisData);
            const { data, error: functionError } = await supabase.functions.invoke('generate-docx', {
                body: thesisData
            });

            if (functionError) {
                console.error('Error from edge function:', functionError);
                toast({
                    title: "Error",
                    description: "Failed to generate the docx",
                    variant: "destructive"
                })
                return;
            }

            const blob = new Blob([data as ArrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
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
        } catch (error: any) {
            console.error('Error exporting DOCX:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to export thesis as DOCX. Please try again.",
                variant: "destructive",
            });
        }
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
    }

    const canManageCollaboratorsProp = currentUserRole === 'owner' || currentUserRole === 'admin' || userProfile?.role === 'admin';
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <ThesisSaveButton thesisId={thesisId} thesisData={thesisData} />
                <Button onClick={handleExportDocx} variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export DOCX
                </Button>
                {email && <UserInfo email={email} role={role} />}
                <CollaboratorSection
                    collaborators={collaborators as CollaboratorWithProfile[]}
                    thesisId={thesisId}
                    thesisTitle={thesisData.frontMatter[0]?.title || 'Untitled Thesis'}
                    canManageCollaborators={canManageCollaboratorsProp}
                    isAdmin={userProfile?.role === 'admin'}
                />
                {canManageCollaborators && (
                    <ReviewerManager thesisId={thesisId} />
                )}
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
                    onClick={handleSaveToJson}
                    className="gap-2"
                >
                    Save as JSON
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
