import { Thesis, Section } from '@/types/thesis';

export interface CentralIconProps {
  thesis: Thesis;
}

export interface CollaboratorOrbitProps {
  thesis: Thesis;
}

export interface ThesisNodeProps {
  section: Section;
  index: number;
  total: number;
}

export interface NotificationsPanelProps {
  thesis: Thesis;
}

export interface StatCardProps {
  title: string;
  value: string;
  suffix?: string;
  trend?: 'up' | 'down' | 'stable';
}