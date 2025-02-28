
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner"; 
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string, redirectPath?: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, redirectPath?: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const { toast: shadowToast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session and get user on component mount
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Session error:", error.message);
          setLoading(false);
          return;
        }
        
        if (session?.user) {
          console.log("Found active session for user:", session.user.id);
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError) {
            console.error("Profile error:", profileError.message);
            // If profile error, we'll still try to use session data
            setUser({
              id: session.user.id,
              name: session.user.user_metadata?.name || '',
              email: session.user.email || '',
              isAdmin: false,
              phone: '',
              company: '',
            });
          } else {
            console.log("Found profile:", profile);
            setUser({
              id: session.user.id,
              name: profile.name || session.user.user_metadata?.name || '',
              email: profile.email || session.user.email || '',
              isAdmin: profile.is_admin || false,
              phone: profile.phone || '',
              company: profile.company || '',
            });
          }
        } else {
          console.log("No active session found");
        }
      } catch (error) {
        console.error('Error fetching session:', error);
      } finally {
        setLoading(false);
      }
    };
    
    getSession();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session);
      
      if (session) {
        // For any event with a session, update the user state
        try {
          // Fetch user profile
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (profileError && profileError.code !== 'PGRST116') {
            console.error('Error fetching profile:', profileError);
            // Still set user with session data if profile fetch fails
            setUser({
              id: session.user.id,
              name: session.user.user_metadata?.name || '',
              email: session.user.email || '',
              isAdmin: false,
              phone: '',
              company: '',
            });
          } else if (profile) {
            setUser({
              id: session.user.id,
              name: profile?.name || session.user.user_metadata?.name || '',
              email: profile?.email || session.user.email || '',
              isAdmin: profile?.is_admin || false,
              phone: profile?.phone || '',
              company: profile?.company || '',
            });
          }
          
          if (event === 'SIGNED_IN') {
            // Show toast notification for sign in
            sonnerToast.success("Autentificare reușită", {
              description: "Te-ai conectat cu succes!"
            });
            
            // Redirect to dashboard after sign in
            navigate('/dashboard');
          }
        } catch (err) {
          console.error('Error in auth state change handler:', err);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out");
        setUser(null);
        sonnerToast.success("Deconectare reușită", {
          description: "Te-ai deconectat cu succes."
        });
      }
      
      setLoading(false);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);
  
  const signIn = async (email: string, password: string, redirectPath?: string) => {
    try {
      console.log("Attempting sign in for:", email);
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error("Sign in error:", error.message);
        throw error;
      }
      
      if (data?.user) {
        console.log("Sign in successful for:", data.user.id);
        
        sonnerToast.success("Autentificare reușită", {
          description: "Te-ai conectat cu succes!"
        });
        
        // Redirect based on user role or provided redirect path
        if (redirectPath) {
          navigate(redirectPath);
        } else {
          const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', data.user.id)
            .single();
            
          if (profile?.is_admin) {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
        }
      }
    } catch (error: any) {
      console.error("Sign in catch error:", error.message);
      sonnerToast.error("Eroare de autentificare", {
        description: error.message || "Credențiale invalide. Încearcă din nou."
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, redirectPath?: string) => {
    try {
      console.log("Attempting sign up for:", email);
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
      
      if (error) {
        console.error("Sign up error:", error.message);
        throw error;
      }
      
      sonnerToast.success("Înregistrare reușită", {
        description: "Contul tău a fost creat cu succes!"
      });
      
      // If email confirmation is required
      if (!data.session) {
        navigate('/verify-email');
        return;
      }
      
      // User data will be set by the auth state change listener
      
      // Redirect to the specified path or dashboard
      if (redirectPath) {
        navigate(redirectPath);
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error("Sign up catch error:", error.message);
      sonnerToast.error("Eroare la înregistrare", {
        description: error.message || "Nu s-a putut crea contul. Încearcă din nou."
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      console.log("Attempting sign out");
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error.message);
        throw error;
      }
      
      // User will be set to null by the auth state change listener
      navigate('/');
    } catch (error: any) {
      console.error("Sign out catch error:", error.message);
      sonnerToast.error("Eroare la deconectare", {
        description: error.message || "Nu s-a putut efectua deconectarea."
      });
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      console.log("Attempting password reset for:", email);
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        console.error("Password reset error:", error.message);
        throw error;
      }
      
      sonnerToast.success("Email trimis", {
        description: "Verifică-ți emailul pentru instrucțiuni de resetare a parolei."
      });
    } catch (error: any) {
      console.error("Password reset catch error:", error.message);
      sonnerToast.error("Eroare la trimiterea emailului", {
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
      
      if (error) {
        throw error;
      }
      
      // Update user state
      setUser({
        ...user,
        ...data,
      });
      
      sonnerToast.success("Profil actualizat", {
        description: "Profilul tău a fost actualizat cu succes!"
      });
    } catch (error: any) {
      console.error("Profile update error:", error.message);
      sonnerToast.error("Eroare la actualizarea profilului", {
        description: error.message || "Nu s-a putut actualiza profilul."
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
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

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
}
