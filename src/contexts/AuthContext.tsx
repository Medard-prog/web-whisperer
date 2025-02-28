
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
        try {
          // Basic user info from session
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            isAdmin: session.user.user_metadata?.isAdmin || false
          });
          
          // Try to fetch additional profile data, but don't block on errors
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (data) {
            setUser(prevUser => ({
              ...prevUser as UserDetails,
              name: data.name || prevUser?.name,
              isAdmin: data.is_admin || prevUser?.isAdmin,
              phone: data.phone,
              company: data.company,
            }));
          }
        } catch (error) {
          console.error('Error setting up user data:', error);
          // Continue with basic user info even if profile fetch fails
        }
      } else {
        setUser(null);
      }
      
      // Listen for auth changes
      const { data: { subscription } } = await supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event);
          setSession(session);
          
          if (session?.user) {
            try {
              // Basic user info from session
              setUser({
                id: session.user.id,
                email: session.user.email || '',
                name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
                isAdmin: session.user.user_metadata?.isAdmin || false
              });
              
              // Try to fetch profile data
              const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
                
              if (data) {
                setUser(prevUser => ({
                  ...prevUser as UserDetails,
                  name: data.name || prevUser?.name,
                  isAdmin: data.is_admin || prevUser?.isAdmin,
                  phone: data.phone,
                  company: data.company,
                }));
              }
            } catch (error) {
              console.error('Error updating user data on auth change:', error);
              // Continue with basic user info
            }
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
  
  // Refresh the user's profile data
  const refreshUser = async () => {
    if (session?.user) {
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (data) {
          setUser(prevUser => ({
            ...prevUser as UserDetails,
            name: data.name,
            isAdmin: data.is_admin,
            phone: data.phone,
            company: data.company,
          }));
        }
      } catch (error) {
        console.error('Error refreshing user data:', error);
        toast.error('Nu s-a putut actualiza profilul');
      }
    }
  };
  
  // Sign out the user
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      navigate('/logout');
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
      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name: userData.name,
          phone: userData.phone,
          company: userData.company,
          updated_at: new Date().toISOString(),
        });
        
      if (error) {
        throw error;
      }
      
      // Update local user state
      setUser({ ...user, ...userData });
      toast.success('Profilul a fost actualizat');
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Nu s-a putut actualiza profilul');
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
