import { Profile } from './profile';

export type CollaboratorRole = 'owner' | 'editor' | 'viewer' | 'admin';

export interface Collaborator {
  user_id: string;
  role: CollaboratorRole;
  created_at?: string;
  profiles: {
    email: string;
    role: string;
    roles?: {
      name: string;
    };
  };
}

export interface CollaboratorWithProfile extends Collaborator {
  profiles: Profile & {
    roles?: {
      name: string;
    };
  };
}