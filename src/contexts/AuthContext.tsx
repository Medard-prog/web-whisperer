import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

export interface UserDetails {
  id: string;
  email: string;
  name?: string;
  isAdmin: boolean;
  phone?: string;
  company?: string;
}

export interface AuthContextType {
  session: Session | null;
  user: UserDetails | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (userData: Partial<UserDetails>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const isAuthenticated = !!session?.user;
  const isAdmin = !!user?.isAdmin;
  const isLoading = loading;

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          setLoading(false);
          return;
        }
        
        setSession(session);
        
        if (session?.user) {
          console.log("Session found, user is logged in:", session.user.id);
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            isAdmin: session.user.user_metadata?.isAdmin || false,
            phone: session.user.user_metadata?.phone || '',
            company: session.user.user_metadata?.company || ''
          });
          
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
              
            if (profileError && profileError.code !== 'PGRST116') {
              console.error('Error fetching profile:', profileError);
            }
              
            if (profileData) {
              console.log("Profile data found:", profileData);
              setUser(prevUser => ({
                ...prevUser as UserDetails,
                name: profileData.name || prevUser?.name,
                isAdmin: profileData.is_admin || prevUser?.isAdmin,
                phone: profileData.phone,
                company: profileData.company,
              }));
            }
          } catch (error) {
            console.error('Error fetching profile data:', error);
          }
        } else {
          console.log("No session found, user is not logged in");
          setUser(null);
        }
        
        const { data: { subscription } } = await supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            console.log('Auth state changed:', event);
            setSession(newSession);
            
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
              if (newSession?.user) {
                console.log("User signed in:", newSession.user.id);
                
                navigate('/dashboard');
                
                setUser({
                  id: newSession.user.id,
                  email: newSession.user.email || '',
                  name: newSession.user.user_metadata?.name || newSession.user.email?.split('@')[0] || 'User',
                  isAdmin: newSession.user.user_metadata?.isAdmin || false,
                  phone: newSession.user.user_metadata?.phone || '',
                  company: newSession.user.user_metadata?.company || ''
                });
                
                try {
                  const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', newSession.user.id)
                    .single();
                    
                  if (profileError && profileError.code !== 'PGRST116') {
                    console.error('Error fetching profile:', profileError);
                  }
                    
                  if (profileData) {
                    console.log("Profile data found on sign in:", profileData);
                    setUser(prevUser => ({
                      ...prevUser as UserDetails,
                      name: profileData.name || prevUser?.name,
                      isAdmin: profileData.is_admin || prevUser?.isAdmin,
                      phone: profileData.phone,
                      company: profileData.company,
                    }));
                  }
                } catch (error) {
                  console.error('Error updating user data on auth change:', error);
                }
              }
            } else if (event === 'SIGNED_OUT') {
              console.log("User signed out");
              setUser(null);
              navigate('/auth');
            }
          }
        );
        
        setLoading(false);
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
      }
    };
    
    initializeAuth();
  }, [navigate]);
  
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error('Error signing in:', error);
        toast.error('Eroare la autentificare', {
          description: error.message
        });
        throw error;
      }

      toast.success('Autentificare reușită');
    } catch (error) {
      console.error('Error in signIn:', error);
      throw error;
    }
  };
  
  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });
      
      if (error) {
        console.error('Error signing up:', error);
        toast.error('Eroare la înregistrare', {
          description: error.message
        });
        throw error;
      }
      
      toast.success('Înregistrare reușită', {
        description: 'Verifică-ți email-ul pentru a confirma contul'
      });
    } catch (error) {
      console.error('Error in signUp:', error);
      throw error;
    }
  };
  
  const refreshUser = async () => {
    if (session?.user) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          console.error('Error refreshing user data:', error);
          toast.error('Nu s-a putut actualiza profilul');
          return;
        }
          
        if (data) {
          console.log("Profile data refreshed:", data);
          setUser(prevUser => ({
            ...prevUser as UserDetails,
            name: data.name || prevUser?.name,
            isAdmin: data.is_admin || prevUser?.isAdmin,
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
  
  const updateProfile = async (userData: Partial<UserDetails>) => {
    if (!user || !session) {
      throw new Error('User not authenticated');
    }
    
    try {
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
        console.error('Error updating profile in database:', error);
        throw error;
      }
      
      setUser({ ...user, ...userData });
      toast.success('Profilul a fost actualizat');
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Nu s-a putut actualiza profilul');
      throw error;
    }
  };
  
  const authValue: AuthContextType = {
    session, 
    user, 
    loading, 
    isAuthenticated,
    isAdmin,
    isLoading,
    signIn,
    signUp,
    signOut, 
    refreshUser,
    updateProfile
  };

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
