
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

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
  updateProfile: (data: Partial<UserDetails>) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize the auth state with the current session
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      
      if (session?.user) {
        await fetchUserProfile(session.user);
      }
      
      // Listen for auth changes
      const { data: { subscription } } = await supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event);
          setSession(session);
          
          if (session?.user) {
            await fetchUserProfile(session.user);
          } else {
            setUser(null);
          }
        }
      );
      
      setLoading(false);
      
      // Cleanup subscription on unmount
      return () => {
        subscription.unsubscribe();
      };
    };
    
    initializeAuth();
  }, []);
  
  // Fetch the user's profile from the profiles table
  const fetchUserProfile = async (authUser: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();
        
      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }
      
      if (data) {
        setUser({
          id: authUser.id,
          email: authUser.email || '',
          name: data.name,
          isAdmin: data.is_admin,
          phone: data.phone,
          company: data.company,
        });
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };
  
  // Refresh the user's profile data
  const refreshUser = async () => {
    if (session?.user) {
      await fetchUserProfile(session.user);
    }
  };
  
  // Sign out the user
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      navigate('/auth');
      toast.success('Te-ai deconectat cu succes');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Eroare la deconectare');
    }
  };
  
  // Update the user's profile
  const updateProfile = async (userData: Partial<UserDetails>) => {
    if (!user || !session) {
      throw new Error('User not authenticated');
    }
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: userData.name,
          phone: userData.phone,
          company: userData.company,
        })
        .eq('id', user.id);
        
      if (error) {
        throw error;
      }
      
      // Update local user state
      setUser({ ...user, ...userData });
      
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };
  
  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      loading, 
      signOut, 
      updateProfile,
      refreshUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
