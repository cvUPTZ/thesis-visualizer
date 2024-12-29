import { Database } from './supabase';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type ThesisCollaborator = Database['public']['Tables']['thesis_collaborators']['Row'];

export interface CollaboratorWithProfile extends ThesisCollaborator {
  profile: Profile;
}

export type CollaboratorRole = 'editor' | 'admin';