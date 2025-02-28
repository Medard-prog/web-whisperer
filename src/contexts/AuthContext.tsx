
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User } from "@/types";

// Define the shape of our Authentication Context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string, redirectPath?: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, redirectPath?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

// Create context with undefined as initial value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);

  // Initialize and maintain auth state when component mounts
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log("Initializing auth state...");
        
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error.message);
          setLoading(false);
          setAuthCheckComplete(true);
          return;
        }
        
        if (session) {
          console.log("Found existing session");
          await fetchUserProfile(session.user.id);
        } else {
          console.log("No active session found");
          setUser(null);
          setLoading(false);
          setAuthCheckComplete(true);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        setLoading(false);
        setAuthCheckComplete(true);
      }
    };
    
    // Helper function to fetch user profile
    const fetchUserProfile = async (userId: string) => {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (error && error.code !== 'PGRST116') {
          console.error("Error fetching profile:", error.message);
          setUser(null);
        } else {
          setUser({
            id: userId,
            name: profile?.name || '',
            email: profile?.email || '',
            isAdmin: profile?.is_admin || false,
            phone: profile?.phone || '',
            company: profile?.company || '',
          });
        }
        
        setLoading(false);
        setAuthCheckComplete(true);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setUser(null);
        setLoading(false);
        setAuthCheckComplete(true);
      }
    };
    
    initializeAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        
        if (event === 'SIGNED_IN') {
          if (session) {
            await fetchUserProfile(session.user.id);
            toast.success("Autentificare reușită", {
              description: "Te-ai conectat cu succes!"
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setLoading(false);
          toast.success("Deconectare reușită", {
            description: "Te-ai deconectat cu succes."
          });
        } else if (event === 'TOKEN_REFRESHED') {
          // Just update the session without a full profile refetch
          if (session && user) {
            console.log("Token refreshed, session updated");
          }
        } else if (event === 'USER_UPDATED') {
          if (session) {
            await fetchUserProfile(session.user.id);
          }
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);
  
  const signIn = async (email: string, password: string) => {
    try {
      console.log("Signing in:", email);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (!data.user) throw new Error("No user returned from sign in");
      
      // Fetch user profile to ensure we have the latest data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
        
      if (profileError && profileError.code !== 'PGRST116') {
        console.error("Error fetching profile:", profileError.message);
      } else {
        setUser({
          id: data.user.id,
          name: profile?.name || data.user.user_metadata?.name || '',
          email: profile?.email || data.user.email || '',
          isAdmin: profile?.is_admin || false,
          phone: profile?.phone || '',
          company: profile?.company || '',
        });
      }
      
      // Navigate to the right place
      //navigate(redirectPath || '/dashboard');
      
    } catch (error: any) {
      console.error("Sign in error:", error.message);
      toast.error("Eroare de autentificare", {
        description: error.message || "Credențiale invalide. Încearcă din nou."
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, redirectPath?: string) => {
    try {
      console.log("Signing up:", email);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });
      
      if (error) throw error;
      
      toast.success("Înregistrare reușită", {
        description: "Contul tău a fost creat cu succes!"
      });
      
      // If email confirmation is required
      if (!data.session) {
        navigate('/verify-email');
        return;
      }
      
      // If email confirmation is not required, user is signed in
      if (data.user) {
        // Create or update the profile record
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            name,
            email,
          });
          
        if (profileError) {
          console.error("Error creating profile:", profileError.message);
        }
        
        setUser({
          id: data.user.id,
          name,
          email,
          isAdmin: false,
          phone: '',
          company: '',
        });
        
        navigate(redirectPath || '/dashboard');
      }
      
    } catch (error: any) {
      console.error("Sign up error:", error.message);
      toast.error("Eroare la înregistrare", {
        description: error.message || "Nu s-a putut crea contul. Încearcă din nou."
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log("Signing out");
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setUser(null);
      navigate('/');
      
    } catch (error: any) {
      console.error("Sign out error:", error.message);
      toast.error("Eroare la deconectare", {
        description: error.message || "Nu s-a putut efectua deconectarea."
      });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      console.log("Resetting password for:", email);
      setLoading(true);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast.success("Email trimis", {
        description: "Verifică-ți emailul pentru instrucțiuni de resetare a parolei."
      });
      
    } catch (error: any) {
      console.error("Password reset error:", error.message);
      toast.error("Eroare la trimiterea emailului", {
        description: error.message || "Nu s-a putut trimite emailul de resetare."
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      if (!user || !user.id) {
        throw new Error("Nu există un utilizator autentificat");
      }
      
      setLoading(true);
      
      const { error } = await supabase
        .from('profiles')
        .update({
          name: data.name,
          email: data.email,
          phone: data.phone,
          company: data.company,
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      // Update user state
      setUser({
        ...user,
        ...data,
      });
      
      toast.success("Profil actualizat", {
        description: "Profilul tău a fost actualizat cu succes!"
      });
      
    } catch (error: any) {
      console.error("Profile update error:", error.message);
      toast.error("Eroare la actualizarea profilului", {
        description: error.message || "Nu s-a putut actualiza profilul."
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Provide context value
  return (
    <AuthContext.Provider
      value={{
        user,
        loading: loading && !authCheckComplete,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
}
