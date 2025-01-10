export interface Feature {
  id: string;
  name: string;
  description?: string;
  status: 'Active' | 'Inactive';
  health: string;
  usage_data?: any;
  last_updated?: string;
  created_at?: string;
  parent_id?: string;
  is_sub_feature?: boolean;
  pricing_tier?: 'free' | 'paid' | 'trial';
  trial_days?: number;
}