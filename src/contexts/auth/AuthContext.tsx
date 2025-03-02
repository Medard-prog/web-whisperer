
import { createContext } from 'react';
import { UserDetails } from './types';

export interface AuthContextType {
  user: UserDetails | null;
  session: any | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, name: string) => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<UserDetails>) => Promise<any>;
  resetPassword: (email: string) => Promise<any>;
  refreshUser: () => Promise<any>;
}

// Create a context with a default undefined value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
