export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  student_id?: string;
  department?: string;
  program?: string;
  year_of_study?: string;
  role_id?: string;
  created_at?: string;
  roles?: {
    name: string;
  };
}