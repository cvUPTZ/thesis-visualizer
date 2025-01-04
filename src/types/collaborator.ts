export type CollaboratorRole = 'owner' | 'admin' | 'editor' | 'viewer';

export interface CollaboratorWithProfile {
  user_id: string;
  role: CollaboratorRole;
  created_at: string;
  profiles: {
    email: string;
    role_id: string;
    roles?: {
      name: string;
    };
  };
}

export interface Collaborator {
  user_id: string;
  role: CollaboratorRole;
  profiles: {
    email: string;
    role: string;
  };
}