import { Profile } from './profile';

export type CollaboratorRole = 'owner' | 'editor' | 'viewer' | 'admin';

export interface Collaborator {
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

export interface CollaboratorWithProfile extends Omit<Collaborator, 'profiles'> {
  profiles: Profile & {
    roles?: {
      name: string;
    };
  };
}