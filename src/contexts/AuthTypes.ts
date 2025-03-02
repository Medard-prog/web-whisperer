
import { Session } from '@supabase/supabase-js';

export interface UserDetails {
  id: string;
  email: string;
  name?: string;
  isAdmin?: boolean;
  phone?: string;
  company?: string;
}

export interface AuthContextType {
  session: Session | null;
  user: UserDetails | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  updateProfile: (data: Partial<UserDetails>) => Promise<void>;
  refreshUser: () => Promise<void>;
}
