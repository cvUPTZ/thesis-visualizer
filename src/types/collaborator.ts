export type CollaboratorRole = 'owner' | 'admin' | 'editor';

export interface CollaboratorWithProfile {
  user_id: string;
  role: CollaboratorRole;
  profile?: {
    email: string;
    role: string;
  };
}