export type CollaboratorRole = 'owner' | 'admin' | 'editor';

export interface CollaboratorWithProfile {
  user_id: string;
  role: CollaboratorRole;
  profiles: {
    email: string;
    role_id: string;
  };
}

export interface Collaborator {
  user_id: string;
  role: CollaboratorRole;
  profiles?: {
    email: string;
    role_id: string;
  };
}