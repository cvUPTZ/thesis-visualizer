export type CollaboratorRole = 'editor' | 'admin' | 'owner';

export interface CollaboratorWithProfile {
  user_id: string;
  role: CollaboratorRole;
  profile?: {
    email: string;
    role: string;
  };
  created_at?: string;
}

export interface CollaboratorInviteFormProps {
  thesisId: string;
  thesisTitle: string;
  onInviteSuccess: () => void;
  onInviteError: (error: Error) => void;
  isAdmin: boolean;
  setIsInviting: (isInviting: boolean) => void;
}