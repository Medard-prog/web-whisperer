
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
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
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
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
      try {
        setLoading(true);
        
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
          setLoading(false);
          return;
        }
        
        setSession(session);
        
        if (session?.user) {
          console.log("Session found, user is logged in:", session.user.id);
          // Basic user info from session
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            isAdmin: session.user.user_metadata?.isAdmin || false
          });
          
          // Try to fetch additional profile data, but don't block on errors
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
            // Continue with basic user info even if profile fetch fails
          }
        } else {
          console.log("No session found, user is not logged in");
          setUser(null);
        }
        
        // Listen for auth changes
        const { data: { subscription } } = await supabase.auth.onAuthStateChange(
          async (event, newSession) => {
            console.log('Auth state changed:', event);
            setSession(newSession);
            
            if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
              if (newSession?.user) {
                console.log("User signed in:", newSession.user.id);
                
                // Navigate to dashboard on successful login
                navigate('/dashboard');
                
                // Basic user info from session
                setUser({
                  id: newSession.user.id,
                  email: newSession.user.email || '',
                  name: newSession.user.user_metadata?.name || newSession.user.email?.split('@')[0] || 'User',
                  isAdmin: newSession.user.user_metadata?.isAdmin || false
                });
                
                // Try to fetch profile data
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
                  // Continue with basic user info
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
        
        // Cleanup subscription on unmount
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
  
  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };
  
  // Sign up with email and password
  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };
  
  // Refresh the user's profile data
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
  
  // Sign out the user
  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      navigate('/auth');
      toast.success('Te-ai deconectat cu succes');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Eroare la deconectare');
    } finally {
      setLoading(false);
    }
  };
  
  // Update the user's profile
  const updateProfile = async (userData: Partial<UserDetails>) => {
    if (!user || !session) {
      throw new Error('User not authenticated');
    }
    
    try {
      setLoading(true);
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
        console.error('Error updating profile in database:', error);
        throw error;
      }
      
      // Update local user state
      setUser({ ...user, ...userData });
      toast.success('Profilul a fost actualizat');
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Nu s-a putut actualiza profilul');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      loading, 
      signIn,
      signUp,
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
