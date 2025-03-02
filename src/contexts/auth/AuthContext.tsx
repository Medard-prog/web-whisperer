
import { createContext } from 'react';
import { Session } from '@supabase/supabase-js';
import { UserDetails } from './types';

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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
