import { ReactNode } from 'react';

export interface BaseProps {
  children?: ReactNode;
  className?: string;
}

export interface WithId {
  id: string;
}

export interface WithTimestamps {
  created_at: string;
  updated_at?: string;
}

export interface WithUser {
  user_id: string;
}

export type Status = 'active' | 'inactive' | 'pending' | 'completed';