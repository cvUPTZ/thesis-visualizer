// File: src/types/collaborator.ts
export type CollaboratorRole = 'owner' | 'admin' | 'editor';

export interface CollaboratorWithProfile {
  user_id: string;
  role: CollaboratorRole;
  profile?: {
    email: string;
    role: string;
  };
}

export interface Collaborator {
  user_id: string;
  role: CollaboratorRole;
  profiles?: {
    email: string;
    role: string;
  };
}