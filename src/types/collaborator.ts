import { Profile } from './profile';

export type CollaboratorRole = 'owner' | 'editor' | 'viewer' | 'admin';

export interface Collaborator {
  user_id: string;
  role: CollaboratorRole;
  created_at: string;
  profiles: Profile;
}

export interface CollaboratorWithProfile extends Collaborator {}