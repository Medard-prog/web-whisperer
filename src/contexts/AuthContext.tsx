import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';
import { toast } from 'sonner';
import { UserDetails, AuthContextType } from './AuthTypes';
import { fetchUserProfile, createUserDetails, handleAuthError } from './AuthUtils';

// Create context with undefined initial value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize auth state
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
          
          // Set basic user info
          const basicUser: UserDetails = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
            isAdmin: session.user.user_metadata?.isAdmin || false
          };
          
          setUser(basicUser);
          
          // Try to fetch additional profile data
          try {
            const profileData = await fetchUserProfile(session.user.id);
            
            if (profileData) {
              console.log("Profile data found:", profileData);
              setUser(current => ({
                ...current as UserDetails,
                name: profileData.name || current?.name,
                isAdmin: profileData.isAdmin || current?.isAdmin,
                phone: profileData.phone,
                company: profileData.company,
              }));
            }
          } catch (error) {
            console.error('Error fetching profile data:', error);
            // Continue with basic user info
          }
        } else {
          console.log("No session found, user is not logged in");
          setUser(null);
        }
        
        // Setup auth state change listener
        setupAuthListener();
        
        setLoading(false);
      } catch (error) {
        console.error('Error initializing auth:', error);
        setLoading(false);
      }
    };
    
    initializeAuth();
    
    // Parse hash fragment for error messages from Supabase auth redirect
    if (location.hash) {
      const hashParams = new URLSearchParams(location.hash.substring(1));
      const error = hashParams.get('error');
      const errorDescription = hashParams.get('error_description');
      
      if (error) {
        console.error('Auth redirect error:', error, errorDescription);
        toast.error('Eroare de autentificare', {
          description: errorDescription || 'A apărut o eroare la autentificare.',
        });
      }
    }
    
    // Cleanup is handled in setupAuthListener
  }, [navigate, location]);
  
  // Setup auth state change listener as a separate function
  const setupAuthListener = async () => {
    const { data: { subscription } } = await supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event);
        setSession(newSession);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (newSession?.user) {
            console.log("User signed in:", newSession.user.id);
            
            // Navigate to dashboard
            navigate('/dashboard');
            
            // Update user data
            const profileData = await fetchUserProfile(newSession.user.id);
            const userData = createUserDetails(newSession, profileData);
            setUser(userData);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log("User signed out");
          setUser(null);
          navigate('/auth');
        } else if (event === 'PASSWORD_RECOVERY') {
          // Handle password recovery
          navigate('/auth/update-password');
        }
      }
    );
    
    // Return the unsubscribe function
    return () => {
      subscription.unsubscribe();
    };
  };
  
  // Authentication functions
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        handleAuthError(error, 'autentificare');
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
        handleAuthError(error, 'înregistrare');
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
  
  const refreshUser = async () => {
    if (session?.user) {
      try {
        const profileData = await fetchUserProfile(session.user.id);
        
        if (profileData) {
          setUser(prevUser => ({
            ...prevUser as UserDetails,
            name: profileData.name || prevUser?.name,
            isAdmin: profileData.isAdmin || prevUser?.isAdmin,
            phone: profileData.phone,
            company: profileData.company,
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
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Error signing out:', error);
        toast.error('Eroare la deconectare');
        throw error;
      }
      
      setUser(null);
      navigate('/auth');
      toast.success('Te-ai deconectat cu succes');
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      
      // Get the current origin URL to use for redirects
      const currentOrigin = window.location.origin;
      console.log("Current origin for reset password redirect:", currentOrigin);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${currentOrigin}/auth/update-password`,
      });
      
      if (error) {
        handleAuthError(error, 'resetare parolă');
        throw error;
      }
      
      toast.success('Email de resetare trimis', {
        description: 'Verifică-ți email-ul pentru a reseta parola'
      });
      
      return true;
    } catch (error) {
      console.error('Error in resetPassword:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  const updatePassword = async (password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) {
        handleAuthError(error, 'actualizare parolă');
        throw error;
      }
      
      toast.success('Parola a fost actualizată');
      
      return true;
    } catch (error) {
      console.error('Error in updatePassword:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
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
  
  // Determine if the user is an admin
  const isAdmin = user?.isAdmin || false;
  
  // Provide context value
  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      loading, 
      signIn,
      signUp,
      signOut, 
      updateProfile,
      refreshUser,
      resetPassword,
      updatePassword,
      isAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export the hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
