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
  console.log("AuthProvider initializing");
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const isAuthenticated = !!session?.user;
  const isAdmin = !!user?.isAdmin;
  const isLoading = loading;

  useEffect(() => {
    console.log("AuthProvider useEffect running");
    const initializeAuth = async () => {
      try {
        console.log("Initializing auth...");
        setLoading(true);
        
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          setLoading(false);
          return;
        }
        
        console.log("Session retrieved:", currentSession ? "Found" : "Not found");
        setSession(currentSession);
        
        if (currentSession?.user) {
          console.log("Session found, user is logged in:", currentSession.user.id);
          setUser({
            id: currentSession.user.id,
            email: currentSession.user.email || '',
            name: currentSession.user.user_metadata?.name || currentSession.user.email?.split('@')[0] || 'User',
            isAdmin: currentSession.user.user_metadata?.isAdmin || false,
            phone: currentSession.user.user_metadata?.phone || '',
            company: currentSession.user.user_metadata?.company || ''
          });
          
          try {
            console.log("Fetching profile data for user:", currentSession.user.id);
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', currentSession.user.id)
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
                phone: profileData.phone || prevUser?.phone,
                company: profileData.company || prevUser?.company,
              }));
            } else {
              console.log("No profile data found for user");
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
                
                setUser({
                  id: newSession.user.id,
                  email: newSession.user.email || '',
                  name: newSession.user.user_metadata?.name || newSession.user.email?.split('@')[0] || 'User',
                  isAdmin: newSession.user.user_metadata?.isAdmin || false,
                  phone: newSession.user.user_metadata?.phone || '',
                  company: newSession.user.user_metadata?.company || ''
                });
                
                try {
                  console.log("Fetching profile data on sign in");
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
                      phone: profileData.phone || prevUser?.phone,
                      company: profileData.company || prevUser?.company,
                    }));
                  }
                } catch (error) {
                  console.error('Error updating user data on auth change:', error);
                }
              }
            } else if (event === 'SIGNED_OUT') {
              console.log("User signed out");
              setUser(null);
            }
          }
        );
        
        setLoading(false);
        console.log("Auth initialization complete, loading set to false");
        
        return () => {
          console.log("Cleaning up auth subscription");
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
      console.log("Attempting sign in for:", email);
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

      console.log("Sign in successful");
      toast.success('Autentificare reușită');
    } catch (error) {
      console.error('Error in signIn:', error);
      throw error;
    }
  };
  
  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log("Attempting sign up for:", email);
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
      
      console.log("Sign up successful");
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
        console.log("Refreshing user data");
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
            phone: data.phone || prevUser?.phone,
            company: data.company || prevUser?.company,
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
      console.log("Signing out user");
      await supabase.auth.signOut();
      setUser(null);
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
      console.log("Updating profile:", userData);
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

  console.log("AuthProvider rendering with state:", { 
    isAuthenticated, 
    isAdmin, 
    isLoading 
  });

  return <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
