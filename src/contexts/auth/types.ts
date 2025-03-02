
export interface UserDetails {
  id: string;
  email: string;
  name?: string;
  isAdmin?: boolean;
  phone?: string;
  company?: string;
}

export interface ProfileData {
  id: string;
  name?: string;
  email?: string;
  is_admin?: boolean;
  phone?: string;
  company?: string;
  created_at?: string;
  updated_at?: string;
}
