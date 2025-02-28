
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
  const [initialized, setInitialized] = useState(false);

  // Initialize auth state when component mounts
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log("Initializing auth state...");
        setLoading(true);
        
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error.message);
          return;
        }
        
        if (session) {
          console.log("Found existing session");
          
          // Fetch user profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError && profileError.code !== 'PGRST116') {
            console.error("Error fetching profile:", profileError.message);
          }
            
          // Set user state
          setUser({
            id: session.user.id,
            name: profile?.name || session.user.user_metadata?.name || '',
            email: profile?.email || session.user.email || '',
            isAdmin: profile?.is_admin || false,
            phone: profile?.phone || '',
            company: profile?.company || '',
          });
        } else {
          console.log("No active session found");
          setUser(null);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };
    
    initializeAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        
        if (event === 'INITIAL_SESSION') {
          // Skip processing, was handled by initializeAuth
          return;
        }
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (!session) return;
          
          try {
            // Fetch user profile
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
              
            if (profileError && profileError.code !== 'PGRST116') {
              console.error("Error fetching profile:", profileError.message);
            }
            
            // Set user state
            setUser({
              id: session.user.id,
              name: profile?.name || session.user.user_metadata?.name || '',
              email: profile?.email || session.user.email || '',
              isAdmin: profile?.is_admin || false,
              phone: profile?.phone || '',
              company: profile?.company || '',
            });
            
            if (event === 'SIGNED_IN') {
              toast.success("Autentificare reușită", {
                description: "Te-ai conectat cu succes!"
              });
              
              // Redirect to dashboard after sign in
              navigate('/dashboard');
            }
          } catch (error) {
            console.error("Error handling auth state change:", error);
          } finally {
            setLoading(false);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          toast.success("Deconectare reușită", {
            description: "Te-ai deconectat cu succes."
          });
        }
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);
  
  const signIn = async (email: string, password: string, redirectPath?: string) => {
    try {
      console.log("Signing in:", email);
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      if (!data.user) throw new Error("No user returned from sign in");
      
      // Auth state change listener will handle user state and redirect
      
    } catch (error: any) {
      console.error("Sign in error:", error.message);
      toast.error("Eroare de autentificare", {
        description: error.message || "Credențiale invalide. Încearcă din nou."
      });
      throw error;
    } finally {
      // Note: We don't set loading to false here because the auth state change listener will do that
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
        setLoading(false);
        navigate('/verify-email');
        return;
      }
      
      // Auth state change listener will handle user state and redirect
      
    } catch (error: any) {
      console.error("Sign up error:", error.message);
      toast.error("Eroare la înregistrare", {
        description: error.message || "Nu s-a putut crea contul. Încearcă din nou."
      });
      throw error;
    } finally {
      // Note: We don't set loading to false here because the auth state change listener will do that
    }
  };

  const signOut = async () => {
    try {
      console.log("Signing out");
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      // Auth state change listener will handle user state and redirect
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
        loading: loading && initialized, // Only show loading state after initialization
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
