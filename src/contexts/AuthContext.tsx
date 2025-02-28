
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types";
import { toast } from "sonner";
import { Navigate, useNavigate } from "react-router-dom";

// Define types for AuthContext
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ error: any } | undefined>;
  signUp: (email: string, password: string, name: string, company?: string, phone?: string) => Promise<{ error: any } | undefined>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any } | undefined>;
}

// Create the auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }

      return data;
    } catch (error) {
      console.error("Unexpected error fetching profile:", error);
      return null;
    }
  };

  // Handle auth state changes
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (currentSession && currentSession.user) {
          const userId = currentSession.user.id;
          const profile = await fetchUserProfile(userId);

          if (profile) {
            setUser({
              id: userId,
              name: profile.name || currentSession.user.email?.split('@')[0] || "",
              email: currentSession.user.email || "",
              isAdmin: profile.is_admin || false,
              phone: profile.phone || "",
              company: profile.company || "",
            });
          } else {
            // If profile isn't found but user is authenticated
            setUser({
              id: userId,
              name: currentSession.user.email?.split('@')[0] || "",
              email: currentSession.user.email || "",
              isAdmin: false,
            });
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Initial session check
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session && session.user) {
          const userId = session.user.id;
          const profile = await fetchUserProfile(userId);
          
          if (profile) {
            setUser({
              id: userId,
              name: profile.name || session.user.email?.split('@')[0] || "",
              email: session.user.email || "",
              isAdmin: profile.is_admin || false,
              phone: profile.phone || "",
              company: profile.company || "",
            });
          } else {
            // If profile isn't found but user is authenticated
            setUser({
              id: userId,
              name: session.user.email?.split('@')[0] || "",
              email: session.user.email || "",
              isAdmin: false,
            });
          }
        }
      } catch (error) {
        console.error("Error checking user session:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        toast.error("Autentificare eșuată", {
          description: error.message,
        });
        return { error };
      }

      // Success message
      toast.success("Autentificare reușită", {
        description: "Bine ai revenit!",
      });
      
      return undefined;
    } catch (error: any) {
      setError(error.message);
      toast.error("Eroare neașteptată", {
        description: error.message,
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Sign up with email and password
  const signUp = async (
    email: string, 
    password: string, 
    name: string,
    company?: string,
    phone?: string
  ) => {
    try {
      setLoading(true);
      
      // Register the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            company,
            phone,
          },
        },
      });

      if (error) {
        setError(error.message);
        toast.error("Înregistrare eșuată", {
          description: error.message,
        });
        return { error };
      }

      // Success message
      toast.success("Înregistrare reușită", {
        description: "Verifică-ți emailul pentru a confirma contul.",
      });

      return undefined;
    } catch (error: any) {
      setError(error.message);
      toast.error("Eroare neașteptată", {
        description: error.message,
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      toast.success("Te-ai deconectat cu succes");
    } catch (error: any) {
      setError(error.message);
      toast.error("Eroare la deconectare", {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message);
        toast.error("Eroare la resetarea parolei", {
          description: error.message,
        });
        return { error };
      }

      toast.success("Email trimis", {
        description: "Verifică-ți emailul pentru instrucțiuni de resetare a parolei.",
      });
      return undefined;
    } catch (error: any) {
      setError(error.message);
      toast.error("Eroare neașteptată", {
        description: error.message,
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  // Provide auth values and functions
  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
